package utils

import (
	"bytes"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"sort"
	"strconv"
)

func GetIteration() string {
	snapshot := getRhinoSnapshot()
	configDir := filepath.Join(os.Getenv("HOME"), ".config", "horns")

	files, err := os.ReadDir(configDir)
	if err != nil {
		return fmt.Sprintf("%s-1", snapshot)
	}

	pattern := fmt.Sprintf(`^%s-([0-9]+)\.json$`, regexp.QuoteMeta(snapshot))
	re := regexp.MustCompile(pattern)

	var iterations []int
	for _, file := range files {
		m := re.FindStringSubmatch(file.Name())
		if len(m) == 2 {
			num, err := strconv.Atoi(m[1])
			if err == nil {
				iterations = append(iterations, num)
			}
		}
	}

	if len(iterations) == 0 {
		return fmt.Sprintf("%s-1", snapshot)
	}

	sort.Ints(iterations)
	next := iterations[len(iterations)-1] + 1
	return fmt.Sprintf("%s-%d", snapshot, next)
}

func getRhinoSnapshot() string {
	cmd := exec.Command("bash", "-c", "cat /etc/os-release")
	var out bytes.Buffer
	cmd.Stdout = &out
	if err := cmd.Run(); err != nil {
		return "unknown"
	}

	re := regexp.MustCompile(`(?m)^VERSION_ID="?([^"\n]+)"?`)
	m := re.FindStringSubmatch(out.String())
	if len(m) > 1 {
		return m[1]
	}
	return "unknown"
}
