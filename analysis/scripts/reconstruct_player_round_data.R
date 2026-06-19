args <- commandArgs(trailingOnly = TRUE)
if (length(args) < 2) {
  stop("Usage: Rscript reconstruct_player_round_data.R input.csv output.csv")
}

data <- read.csv(args[[1]], stringsAsFactors = FALSE)
keys <- c("game_id", "group_id", "round", "actor_id")
missing <- setdiff(keys, names(data))
if (length(missing) > 0) {
  stop(paste("Missing columns:", paste(missing, collapse = ", ")))
}

split_rows <- split(data, interaction(data[keys], drop = TRUE))
rows <- lapply(split_rows, function(group) {
  last <- group[nrow(group), , drop = FALSE]
  data.frame(
    game_id = last$game_id,
    group_id = last$group_id,
    round = last$round,
    actor_id = last$actor_id,
    actor_type = if ("actor_type" %in% names(last)) last$actor_type else "",
    stage = if ("stage" %in% names(last)) last$stage else "",
    action_type = if ("action_type" %in% names(last)) last$action_type else "",
    action_value = if ("action_value" %in% names(last)) last$action_value else "",
    payoff = if ("payoff" %in% names(group)) sum(as.numeric(group$payoff), na.rm = TRUE) else "",
    treatment = if ("treatment" %in% names(last)) last$treatment else "",
    n_source_records = nrow(group),
    stringsAsFactors = FALSE
  )
})

output <- do.call(rbind, rows)
dir.create(dirname(args[[2]]), recursive = TRUE, showWarnings = FALSE)
write.csv(output, args[[2]], row.names = FALSE)
