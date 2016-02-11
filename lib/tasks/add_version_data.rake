BUILD_VERSIONS = {
  'ios' => {
    '0.20.0' => '6axwpbv4zb4nwnwk2686h3gkj4'
  },
  'android' => {
    '0.20.0' => 'd8wtae190m9978vwx5mv228erw'
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
