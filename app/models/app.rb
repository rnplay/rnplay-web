class App < ActiveRecord::Base

  before_save :add_url_token
  before_save :parse_module_name

  validates :name, presence: true

  # for apps pushed from the cli

  # TODO: extract the build from package.json
  after_create :extract_build, if: :uses_git?
  after_create :create_bare_git_repo, if: :uses_git?

  # for apps created in the editor

  after_save :write_js_to_disk, unless: :uses_git?

  validates :body, presence: true, unless: :uses_git?
  validates :build_id, presence: true, unless: :uses_git?

  belongs_to :creator, class_name: "User"
  belongs_to :build

  def to_param
    url_token
  end

  def bundle_url
    path = uses_git? ? "#{name}/index.ios.bundle" : "#{url_token}.bundle"
    if Rails.env.development?
      "http://#{ENV['NGROK_SUBDOMAIN']}.ngrok.io/#{path}"
    else
      "https://packager#{build.name.gsub(".", "").gsub("-", "")}.rnplay.org/#{path}"
    end
  end

  # for upcoming multi-file app support
  def bundle_path
    "/#{url_token}.bundle"
  end

  def parse_module_name
    if uses_git?
      self.module_name = self.name
    else
      self.module_name = body.scan(/module.exports\W=\W(.+);/).flatten.first
    end
  end

  def increment_view_count!
    update_columns(view_count: view_count + 1)
  end

  def write_js_to_disk
    root = "#{Rails.root}/app_js"
    FileUtils.mkdir_p root
    File.open("#{root}/#{self.url_token}.js", "w") {|f| f.write body }
  end

  def appetize_url(options = {})
    options[:embed] ||= false
    options[:screen_only] ||= false
    options[:autoapp] ||= false

    params = {
      "bundleUrl" => bundle_url,
      "moduleName" => module_name,
      "RCTDevMenu" => {
        "liveReloadEnabled" => true
      }
    }.to_json

    url = "https://appetize.io/#{options[:embed] ? 'embed' : 'app'}/" +
    "#{appetize_public_key}?" +
    "device=iphone5s&scale=75&orientation=portrait" +
    "&screenOnly=#{options[:screen_only]}" +
    "&xdocMsg=true" +
    "&autoapp=#{options[:autoapp]}" +
    "&deviceColor=white" +
    "&params=#{URI.encode(params)}"

    logger.info url
    url
  end

  def appetize_public_key
    build.appetize_id
  end

  def created_by?(user)
    !user.nil? && self.creator == user
  end

  def source_git_repo_path
    "/var/repos/#{name}.git"
  end

  def target_git_repo_path
    "#{Rails.root}/app_js/#{name}"
  end

  def source_git_hook_path
    "#{source_git_repo_path}/hooks/post-receive"
  end

  def create_bare_git_repo
    run "git --bare init --shared #{source_git_repo_path}"
    run "cp #{Rails.root}/config/git-post-receive #{source_git_hook_path}"
    run "chmod 755 #{source_git_hook_path} && chown -R app:app #{source_git_hook_path}"
  end

  def git_file_contents
    Dir.glob("#{target_git_repo_path}/**/*.{js,json}").reject do |f|
      f['node_modules'] ||
      f['iOS']
    end.inject({}) do |hash, path|
      base = path.gsub("#{target_git_repo_path}/", "")
      logger.info "BASE #{base}"
      hash[base] = File.read(path)
      hash
    end
  end

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

  def rn_version_from_package_json
    version = JSON.parse(File.read(target_git_repo_path+"/package.json"))['dependencies']['react-native']
    version.gsub("^", "")
  end

  def extract_build
    # if build = Build.find_by(name: rn_version_from_package_json)
    #   self.build = build
    # else
      self.build = Build.find_by(name: 'master')
      save
    # end
  end

  def add_url_token
    return if url_token
    generate_url_token
    until !self.class.exists?(url_token: self.url_token) do
      generate_url_token
    end
  end

  def generate_url_token
    self.url_token = SecureRandom.urlsafe_base64(4)
  end
end
