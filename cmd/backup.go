package cmd

import (
	"fmt"
	"os"
	"os/exec"
	"strings"

	"encoding/json"
	"horns/utils"
	"path/filepath"

	"github.com/spf13/cobra"
)

func GetAptPackages() ([]string, error) {
	cmd := exec.Command("bash", "-c", "dpkg --get-selections | grep -v deinstall")
	out, err := cmd.Output()
	if err != nil {
		return nil, err
	}
	lines := strings.Split(strings.TrimSpace(string(out)), "\n")
	var packages []string
	for _, line := range lines {
		parts := strings.Fields(line)
		if len(parts) > 0 {
			packages = append(packages, parts[0])
		}
	}
	return packages, nil
}

func GetPacstallPackages() ([]string, error) {
	cmd := exec.Command("pacstall", "-L")
	out, err := cmd.Output()
	if err != nil {
		return nil, err
	}
	lines := strings.Split(strings.TrimSpace(string(out)), "\n")
	var packages []string
	for _, line := range lines {
		parts := strings.Fields(line)
		if len(parts) > 0 {
			packages = append(packages, parts[0])
		}
	}
	return packages, nil
}

func StructureBackup(aptPackages []string, pacstallPackages []string) map[string]any {
	return map[string]any{
		"custom_packages": map[string]any{
			"apt": aptPackages,
		},
	}
}

var backupCmd = &cobra.Command{
	Use:   "backup",
	Short: "Backup system configuration",
	Run: func(cmd *cobra.Command, args []string) {
		aptPackages, err := GetAptPackages()
		if err != nil {
			fmt.Printf("Error retrieving APT packages: %v\n", err)
			return
		}
		pacstallPackages, err := GetPacstallPackages()
		if err != nil {
			fmt.Printf("Error retrieving Pacstall packages: %v\n", err)
			return
		}
		backupFile := StructureBackup(aptPackages, pacstallPackages)
		iteration := utils.GetIteration()
		configDir := filepath.Join(os.Getenv("HOME"), ".config", "horns")
		if _, err := os.Stat(configDir); os.IsNotExist(err) {
			if err := os.MkdirAll(configDir, 0755); err != nil {
				fmt.Printf("Error creating config directory: %v\n", err)
				return
			}
		}
		outputFile := filepath.Join(configDir, fmt.Sprintf("%s.json", iteration))
		data, _ := json.MarshalIndent(backupFile, "", "  ")
		if err := os.WriteFile(outputFile, data, 0644); err != nil {
			fmt.Printf("Error writing backup file: %v\n", err)
			return
		}
		fmt.Printf("Backup saved to %s\n", outputFile)
	},
}

func init() {
	rootCmd.AddCommand(backupCmd)
}
