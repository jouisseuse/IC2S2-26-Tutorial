args <- commandArgs(trailingOnly = TRUE)
if (length(args) < 2) {
  stop("Usage: Rscript compute_social_learning_outcomes.R input.csv output.csv [true_value]")
}

data <- read.csv(args[[1]], stringsAsFactors = FALSE)
true_value <- if (length(args) >= 3) as.numeric(args[[3]]) else NA
keys <- c("game_id", "group_id", "round")
split_rows <- split(data, interaction(data[keys], drop = TRUE))

rows <- lapply(split_rows, function(group) {
  estimate <- as.numeric(if ("action_value" %in% names(group)) group$action_value else group$estimate)
  group_average <- mean(estimate, na.rm = TRUE)
  group$estimate <- estimate
  group$group_average <- group_average
  group$distance_from_group_average <- abs(estimate - group_average)
  group$absolute_error <- if (!is.na(true_value)) abs(group_average - true_value) else NA
  group
})

output <- do.call(rbind, rows)
dir.create(dirname(args[[2]]), recursive = TRUE, showWarnings = FALSE)
write.csv(output, args[[2]], row.names = FALSE)
