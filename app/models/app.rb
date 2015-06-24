class App < ActiveRecord::Base

  before_save :add_url_token

  validates :name, presence: true

  after_create :setup_git_repo
  after_create :set_module_name

  belongs_to :creator, class_name: "User"
  belongs_to :build

  def to_param
    url_token
  end

  def bundle_url
    path = "#{url_token}/index.ios.bundle"
    if Rails.env.development?
      "http://#{ENV['NGROK_SUBDOMAIN']}.ngrok.io/#{path}"
    elsif Rails.env.staging?
      "https://packager-staging.rnplay.org/#{path}"
    else
      "https://packager#{build.name.gsub(".", "").gsub("-", "")}.rnplay.org/#{path}"
    end
  end

  def set_module_name
    # TODO: parse module name from index.ios.js when it gets saved

    self.module_name = name
    save
  end

  def increment_view_count!
    update_columns(view_count: view_count + 1)
  end

  def appetize_url(options = {})
    options[:embed] ||= false
    options[:screen_only] ||= false
    options[:autoapp] ||= false
    options[:app_params] ||= {}

    params = {
      "bundleUrl" => bundle_url,
      "moduleName" => module_name,
      "RCTDevMenu" => {
        "liveReloadEnabled" => true
      }
    }.merge(options[:app_params]).to_json

    url = "https://appetize.io/#{options[:embed] ? 'embed' : 'app'}/" +
    "#{appetize_public_key}?" +
    "device=iphone5s&scale=75&orientation=portrait" +
    "&screenOnly=#{options[:screen_only]}" +
    "&xdocMsg=true" +
    "&autoapp=#{options[:autoapp]}" +
    "&deviceColor=white" +
    "&params=#{URI.encode(params)}"
  end

  def appetize_public_key
    build.appetize_id
  end

  def created_by?(user)
    !user.nil? && self.creator == user
  end

  def source_git_repo
    path = Rails.env.development? ? "#{Rails.root}/repos/#{url_token}.git" : "/var/repos/#{url_token}.git"
    GitRepo.new(path)
  end

  def target_git_repo
    GitRepo.new("#{Rails.root}/app_js/#{url_token}")
  end

  private

  def setup_git_repo
    source_git_repo.create_as_bare
    target_git_repo.clone_from(source_git_repo)
    target_git_repo.update_file("index.ios.js", File.read("#{Rails.root}/apps/sample_app.js"))
  end

  def rn_version_from_package_json
    # version = JSON.parse(target_git_repo.files."/package.json"))['dependencies']['react-native']
    # version.gsub("^", "")
  end

  def extract_build
    self.build = Build.find_by(name: 'master')
    save
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
