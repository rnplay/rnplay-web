require 'rugged'
require 'fileutils'

class GitRepo

  attr_accessor :path

  def initialize(path)
    @path = path
  end

  def destroy
    FileUtils.rm_rf path
  end

  def clone_from(source)
    run "git clone #{source.path} #{path}"
  end

  def commit_all_changes
    run "cd #{path} && git add . && git commit --author \"React Native Playground <info@rnplay.org>\" -a -m \"Initial commit.\" && git push origin master"
  end

  def create_as_bare
    Rugged::Repository.init_at(path, :bare)
    run "cp #{Rails.root}/config/git-post-receive #{path}/hooks/post-receive"
    run "chmod 755 #{path}/hooks/post-receive && chown -R app:app #{path}"
  end

  def bare?
    Rugged::Repository.new(path).bare?
  end

  def files_with_contents
    file_list.inject({}) do |hash, path|
      base = path.gsub("#{@path}/", "")
      hash[base] = File.read(path)
      hash
    end
  end

  def contents_of_file(filename)
    File.read("#{@path}/#{filename}")
  end

  def file_list
    Dir.glob("#{path}/**/*.{js,json}").reject {|f| f['node_modules'] || f['iOS']}
  end

  # TODO: refactor to File model
  def update_file(name, content)
    File.open("#{path}/#{name}", "w") do |file|
      file.write(content)
    end
  end

  def fork_to(target_repo)
    Rails.logger.info(path)
    Rails.logger.info(target_repo.path)

    run "cp -pr #{path} #{target_repo.path}"
  end

  private

  def run(cmd)
    Rails.logger.info "Running #{cmd}"
    Rails.logger.info `#{cmd}`
  end

end
