module Commands
  def run(cmd)
    Rails.logger.info "Running #{cmd}"
    Rails.logger.info `#{cmd}`
  end
end
