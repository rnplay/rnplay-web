BUILD_VERSIONS = {
  'ios' => {
    '0.20.0' => 'g8au7dh2pkm5mdtthjwxb2r2er',
    '0.21.0' => 'ag7twzt8pe400kb3yad0r0yy8w'
  },
  'android' => {
    '0.20.0' => 'd8wtae190m9978vwx5mv228erw',
    '0.21.0' => '4cjhgh3ud6bdwqcbtkeprqgfx0'
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
