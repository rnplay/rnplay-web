BUILD_VERSIONS = {
  '0.8.0-rc2' => 'zw2j7w7dkynjna8qrgtn1x68cw'
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
