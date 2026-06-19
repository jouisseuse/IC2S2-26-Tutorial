args <- commandArgs(trailingOnly = TRUE)
if (length(args) < 2) {
  stop("Usage: Rscript reconstruct_group_round_data.R input.csv output.csv")
}

data <- read.csv(args[[1]], stringsAsFactors = FALSE)
keys <- c("game_id", "group_id", "round")
missing <- setdiff(keys, names(data))
if (length(missing) > 0) {
  stop(paste("Missing columns:", paste(missing, collapse = ", ")))
}

split_rows <- split(data, interaction(data[keys], drop = TRUE))
rows <- lapply(split_rows, function(group) {
  actions <- if ("action_value" %in% names(group)) as.numeric(group$action_value) else numeric()
  payoffs <- if ("payoff" %in% names(group)) as.numeric(group$payoff) else numeric()
  data.frame(
    game_id = group$game_id[[1]],
    group_id = group$group_id[[1]],
    round = group$round[[1]],
    n_players = length(unique(group$actor_id)),
    mean_action_value = mean(actions, na.rm = TRUE),
    total_action_value = sum(actions, na.rm = TRUE),
    mean_payoff = mean(payoffs, na.rm = TRUE),
    total_payoff = sum(payoffs, na.rm = TRUE),
    treatment = if ("treatment" %in% names(group)) group$treatment[[1]] else "",
    stringsAsFactors = FALSE
  )
})

output <- do.call(rbind, rows)
dir.create(dirname(args[[2]]), recursive = TRUE, showWarnings = FALSE)
write.csv(output, args[[2]], row.names = FALSE)
