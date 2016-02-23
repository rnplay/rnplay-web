BUILD_VERSIONS = {
  'ios' => {
    '0.20.0' => 'g8au7dh2pkm5mdtthjwxb2r2er'
  },
  'android' => {
    '0.20.0' => 'm9472d118vcam3yb342yyp5u40'
  }
}

module BuildVersionUpdater
  extend self

  def execute
    BUILD_VERSIONS.each do |platform, versions|
      versions.each do |name, public_key|
        build = Build.where(name: name, platform: platform).first
        if build.blank?
          Build.create(name: name, appetize_id: public_key, platform: platform)
          puts "Added build: #{platform}:#{name}:#{public_key}"
        else
          build.update_attributes(name: name, appetize_id: public_key, platform: platform)
          puts "Updated build: #{platform}:#{name}:#{public_key}"
        end
      end
    end
  end
end

task add_version_data: [:environment] do
  BuildVersionUpdater.execute
end
