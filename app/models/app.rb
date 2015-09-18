class App < ActiveRecord::Base

  before_save :add_url_token

  attr_accessor :created_from_web

  after_create :setup_git_repo
  after_create :set_module_name
  before_create :assign_build

  after_destroy :remove_git_repos

  belongs_to :creator, class_name: "User"
  belongs_to :build
  belongs_to :forked_app, class_name: "App"

  def to_param
    url_token
  end

  def bundle_url
    if Rails.env.development?
      "http://#{ENV['NGROK_SUBDOMAIN']}.ngrok.io#{bundle_path}"
    elsif Rails.env.staging?
      "https://packagerstaging#{build.short_name}.rnplay.org#{bundle_path}"
    else
      "https://packager#{build.short_name}.rnplay.org#{bundle_path}"
    end
  end

  def packager_url_template
    if Rails.env.development?
      "http://#{ENV['NGROK_SUBDOMAIN']}.ngrok.io${bundlePath}"
    elsif Rails.env.staging?
      "https://packagerstaging${buildShortName}.rnplay.org${bundlePath}"
    else
      "https://packager${buildShortName}.rnplay.org${bundlePath}"
    end
  end

  def bundle_path
    "/#{Rails.env.development? ? '' : 'js/'}#{url_token}/index.ios.bundle"
  end

  def cross_platform_bundle_path
    "/#{Rails.env.development? ? '' : 'js/'}#{url_token}"
  end

  def set_module_name
    if target_git_repo.has_file?('index.ios.js')
      self.module_name = target_git_repo.contents_of_file('index.ios.js').lines.grep(/registerComponent/).first.scan(/"(.+)"|'(.+)'/).flatten.compact.first
    else
      self.module_name = name
    end
    save
  end

  def increment_view_count!
    update_columns(view_count: view_count + 1)
  end

  def appetize_options(options = {})

    options[:embed] ||= false
    options[:screen_only] ||= false
    options[:autoapp] ||= false
    options[:app_params] ||= {}

    options[:app_params] = {
      "bundlePath" => cross_platform_bundle_path,
      "packagerUrlTemplate" => packager_url_template,
      "moduleName" => module_name,
      "RCTDevMenu" => { "liveReloadEnabled" => true }
    }.merge(options[:app_params])

    options.merge({
      device: build.platform == 'android' ? 'nexus5' : 'iphone5',
      scale: '75',
      orientation: 'portrait',
      screenOnly: false,
      xdocMsg: true,
      deviceColor: 'white',
      debug: 'true',
    })

  end

  def appetize_url(options = {})
    options[:embed] ||= false
    options[:screen_only] ||= false
    options[:autoapp] ||= false
    options[:app_params] ||= {}

    params = {
      "bundleUrl" => bundle_url,
      "moduleName" => module_name,
      "debug" => true,
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
    "&debug=true" +
    "&params=#{URI.encode(params)}"
  end

  def appetize_public_key
    build.appetize_id
  end

  def created_by?(user)
    !user.nil? && self.creator == user
  end

  def source_git_repo
    root = Rails.env.development? ? "#{Rails.root}/repos" : "/var/repos"
    FileUtils.mkdir_p root
    GitRepo.new("#{root}/#{url_token}.git")
  end

  def target_git_repo
    GitRepo.new("#{Rails.root}/app_js/#{url_token}")
  end

  def migrate_to_git
    logger.info "Migrating #{url_token} to git"
    setup_git_repo
    target_git_repo.update_file("index.ios.js", body)
    target_git_repo.commit_all_changes("Initial commit from rnplay.org")
  end

  def migrated_to_git?
    source_git_repo.exists?
  end

  private

  def remove_git_repos
    source_git_repo.destroy
    target_git_repo.destroy
  end

  def setup_git_repo
    if forked_app
      forked_app.source_git_repo.fork_to source_git_repo
    else
      source_git_repo.create_as_bare
    end

    target_git_repo.clone_from(source_git_repo)

    if created_from_web
      target_git_repo.update_file("index.ios.js", File.read("#{Rails.root}/apps/sample_app.js"))
      target_git_repo.update_file("index.android.js", File.read("#{Rails.root}/apps/sample_app.js"))
      target_git_repo.commit_all_changes("Initial commit from rnplay.org") unless Rails.env.development?
    end
  end

  def assign_build
    self.build = Build.default
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
