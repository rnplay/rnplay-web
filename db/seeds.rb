# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

u = User.create(email: "info@rnplay.org", password: "rnplay", password_confirmation: "rnplay")
u.apps.create({
  name: "Sample App",
  module_name: "SampleApp",
  build_id: Build.last.id,
  created_from_web: true
})
