package cmd

import "github.com/spf13/cobra"

var rootCmd = &cobra.Command{
	Use:   "horns",
	Short: "Horns",
}

func Execute() error {
	return rootCmd.Execute()
}
