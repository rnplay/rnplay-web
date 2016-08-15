BUILD_VERSIONS = {
  'ios' => {
    '0.20.0' => 'g8au7dh2pkm5mdtthjwxb2r2er',
    '0.21.0' => 'ag7twzt8pe400kb3yad0r0yy8w',
    '0.24.1' => 'mzv0wej631g9mxc881x2wmnpvc',
    '0.31.0' => '6e3avyjpcu74460vbzqrffq3t4'
  },
  'android' => {
    '0.20.0' => 'd8wtae190m9978vwx5mv228erw',
    '0.21.0' => '4cjhgh3ud6bdwqcbtkeprqgfx0',
    '0.24.1' => '8bx06h5q4et704jcjggk25zkfw',
    '0.31.0' => 'rkwyy8kaabjhz3zq2160n9gprw'
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
