BUILD_VERSIONS = {
  'ios' => {
    '0.8.0-rc2' => 'zw2j7w7dkynjna8qrgtn1x68cw',
    '0.10.0-rc' => 'rhhd3kmuvyx1mu3r06hh45emy8',
    '0.11.0-rc' => 'u702ejhe26p438rp73c74uyxur'
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
