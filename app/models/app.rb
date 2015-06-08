class App < ActiveRecord::Base

  before_save :add_url_token
  before_save :parse_module_name
  after_save :write_js_to_disk
  validates :name, presence: true
  validates :body, presence: true
  validates :build_id, presence: true

  belongs_to :creator, class_name: "User"
  belongs_to :build

  def to_param
    url_token
  end

  def bundle_url
    if Rails.env.development?
      "http://#{ENV['NGROK_SUBDOMAIN']}.ngrok.io/#{url_token}.bundle"
    else
      "https://packager#{build.name.gsub(".", "").gsub("-", "")}.rnplay.org/#{url_token}.bundle"
    end
  end

  # for upcoming multi-file app support
  def bundle_path
    "/#{url_token}.bundle"
  end

  def parse_module_name
    self.module_name = body.scan(/module.exports\W=\W(.+);/).flatten.first
  end

  def increment_view_count!
    update_columns(view_count: view_count + 1)
  end

  def bundle_js
    logger.info "Writing js to disk for #{url_token}"
    File.open(Rails.root+"#{self.url_token}.js", "w") {|f| f.write body }
    logger.info "Bundling #{url_token}"
    logger.info `node cli.js bundle --id #{self.url_token}`
    logger.info "Saving bundle to db"
    bundle_data = File.read(Rails.root+"public/#{self.url_token}.js")
    update_column :bundle, bundle_data
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

  def take_simulator_screenshot
    logger.info `phantomjs --ssl-protocol=any /app/screenshot.js https://rnapp.org/apps/#{url_token}/raw_simulator /app/public/screenshots/#{url_token}.png`
  end

  private

  def queue_for_bundling
    BundleJob.new.async.perform(id)
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
