args <- commandArgs(trailingOnly = TRUE)
if (length(args) < 2) {
  stop("Usage: Rscript summarize_dataset.R input.csv output.csv")
}

data <- read.csv(args[[1]], stringsAsFactors = FALSE)
summary <- data.frame(
  n_rows = nrow(data),
  n_games = if ("game_id" %in% names(data)) length(unique(na.omit(data$game_id))) else NA,
  n_groups = if ("group_id" %in% names(data)) length(unique(na.omit(data$group_id))) else NA,
  n_rounds = if ("round" %in% names(data)) length(unique(na.omit(data$round))) else NA,
  n_actors = if ("actor_id" %in% names(data)) length(unique(na.omit(data$actor_id))) else NA,
  actor_types = if ("actor_type" %in% names(data)) paste(sort(unique(data$actor_type)), collapse = ";") else "",
  stringsAsFactors = FALSE
)

dir.create(dirname(args[[2]]), recursive = TRUE, showWarnings = FALSE)
write.csv(summary, args[[2]], row.names = FALSE)
