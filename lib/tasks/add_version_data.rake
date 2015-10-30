BUILD_VERSIONS = {
  'ios' => {
    '0.11.0' => 'u702ejhe26p438rp73c74uyxur',
    '0.11.4' => 'uadu4b8e6y09rtx1npfzbz4k5c'
    '0.13.0-rc' => 'eqcjqpytnc26txac3h5nr3081m'
  },
  'android' => {
    '0.11.0' => '0848u8hf8wn40qmarcf7xemqx4',
    '0.13.0-rc' => 'a706nw9xmv0w43qrf77th4dmxg'
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
