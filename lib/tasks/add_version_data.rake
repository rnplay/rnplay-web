BUILD_VERSIONS = {
  'ios' => {
    '0.11.0' => 'u702ejhe26p438rp73c74uyxur'
  },
  'android' => {
    '0.11.0' => '0848u8hf8wn40qmarcf7xemqx4'
  }
}

module BuildVersionUpdater
  extend self

  def execute
    BUILD_VERSIONS.each do |platform, versions|
      versions.each do |name, public_key|
        build = Build.where(name: name, appetize_id: public_key, platform: platform).first
        if build.blank?
          Build.create(name: name, appetize_id: public_key, platform: platform)
          puts "Added build: #{platform}:#{name}:#{public_key}"
        end
      end
    end
  end
end

task add_version_data: [:environment] do
  BuildVersionUpdater.execute
end
