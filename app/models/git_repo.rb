class GitRepo

  attr_accessor :path

  def initialize(path)
    @path = path
  end

  def create_as_bare
    raise ArgumentError, "Repo at #{path} exists already" if File.exists?(path)

    run "git --bare init --shared #{path}"
    run "cp #{Rails.root}/config/git-post-receive #{path}/hooks/post-receive"
    run "chmod 755 #{path} && chown -R app:app #{path}"
  end

  def bare?
    File.exists?("#{path}/hooks")
  end

  def files_with_contents
    file_list.inject({}) do |hash, path|
      base = path.gsub("#{path}/", "")
      hash[base] = File.read(path)
      hash
    end
  end

  def file_list
    Dir.glob("#{path}/**/*.{js,json}").reject {|f| f['node_modules'] || f['iOS']}
  end

  # TODO: refactor to File model
  def update_file(name, content)
    File.open("#{target_git_repo_path}/#{name}", "w") do |file|
      file.write(content)
    end
  end

  private

  def run(cmd)
    logger.info "Running #{cmd}"
    logger.info `#{cmd}`
  end

end
