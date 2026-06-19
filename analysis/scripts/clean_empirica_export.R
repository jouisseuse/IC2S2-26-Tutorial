args <- commandArgs(trailingOnly = TRUE)
if (length(args) < 2) {
  stop("Usage: Rscript clean_empirica_export.R input.csv output.csv")
}

input <- args[[1]]
output <- args[[2]]

data <- read.csv(input, stringsAsFactors = FALSE, check.names = FALSE)
names(data) <- tolower(gsub("[ -]+", "_", names(data)))

if (!"actor_id" %in% names(data)) {
  data$actor_id <- if ("player_id" %in% names(data)) data$player_id else NA
}
if (!"game_id" %in% names(data)) {
  data$game_id <- if ("gameid" %in% names(data)) data$gameid else NA
}
if (!"group_id" %in% names(data)) {
  data$group_id <- if ("groupid" %in% names(data)) data$groupid else NA
}

dir.create(dirname(output), recursive = TRUE, showWarnings = FALSE)
write.csv(data, output, row.names = FALSE)

