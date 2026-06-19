args <- commandArgs(trailingOnly = TRUE)
if (length(args) < 3) {
  stop("Usage: Rscript merge_llm_logs.R behavior.csv llm_logs.csv output.csv")
}

behavior <- read.csv(args[[1]], stringsAsFactors = FALSE)
llm <- read.csv(args[[2]], stringsAsFactors = FALSE)
join_keys <- c("game_id", "group_id", "round", "stage", "actor_id")
available <- intersect(join_keys, intersect(names(behavior), names(llm)))
merged <- merge(behavior, llm, by = available, all.x = TRUE, suffixes = c("", "_llm"))

dir.create(dirname(args[[3]]), recursive = TRUE, showWarnings = FALSE)
write.csv(merged, args[[3]], row.names = FALSE)
