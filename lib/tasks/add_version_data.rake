BUILD_VERSIONS = {
  '0.4.2' => 'dhw0pbp14v89w60quwrj6w70dg',
  '0.4.3' => 'xhubtxzxcju91up5ffgzc760zg',
  '0.4.4' => 'n401rx793yfurzy1kr9c3bc97r',
  '0.5.0' => 'pq7vkwch26pyr0zbn0051ye210',
  '0.6.0' => 'zq3p7vdfvx1848vxyaub0fj3cw',
  '0.7.1' => 'ukbrertg01k0gcdkb604pdz4j4'
}

module BuildVersionUpdater
  extend self

  def execute
    BUILD_VERSIONS.each do |name, public_key|
      build = Build.where(name: name, appetize_id: public_key).first

      if build.blank?
        Build.create(name: name, appetize_id: public_key)
        puts "Added build: #{name}:#{public_key}"
      end
    end
  end
end

task add_version_data: [:environment] do
  BuildVersionUpdater.execute
end
