args <- commandArgs(trailingOnly = TRUE)
if (length(args) < 2) {
  stop("Usage: Rscript compute_public_goods_outcomes.R input.csv output.csv [endowment] [multiplier]")
}

data <- read.csv(args[[1]], stringsAsFactors = FALSE)
endowment <- if (length(args) >= 3) as.numeric(args[[3]]) else 10
multiplier <- if (length(args) >= 4) as.numeric(args[[4]]) else 1.5
keys <- c("game_id", "group_id", "round")
split_rows <- split(data, interaction(data[keys], drop = TRUE))

rows <- lapply(split_rows, function(group) {
  contribution <- as.numeric(if ("action_value" %in% names(group)) group$action_value else group$contribution)
  total <- sum(contribution, na.rm = TRUE)
  public_return <- total * multiplier / nrow(group)
  group$contribution <- contribution
  group$total_contribution <- total
  group$average_contribution <- total / nrow(group)
  group$public_return <- public_return
  group$computed_payoff <- endowment - contribution + public_return
  group
})

output <- do.call(rbind, rows)
dir.create(dirname(args[[2]]), recursive = TRUE, showWarnings = FALSE)
write.csv(output, args[[2]], row.names = FALSE)
