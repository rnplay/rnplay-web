class SupportMailer < ApplicationMailer
  def contact(email, message)
    mail(to: 'info@rnplay.org', from: 'info@rnplay.org', subject: "Support request from #{email}", body: message)
  end
end
