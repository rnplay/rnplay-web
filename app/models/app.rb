class App < ActiveRecord::Base

  before_save :add_url_token

  validates :name, presence: true

  after_create :create_bare_git_repo
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
    GitRepo.new(source_git_repo_path)
  end

  def source_git_repo_path
    Rails.env.development? ? "#{Rails.root}/repos/#{url_token}.git" : "/var/repos/#{url_token}.git"
  end


  private
  
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
