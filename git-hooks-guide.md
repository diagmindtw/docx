# Git Hooks 使用指南

## tl;dr

不需要每次手動更新`./sec`中的資料

## 什麼是 Git Hooks?

Git Hooks 是在 Git 執行特定事件時自動觸發的腳本。這些事件包括提交(commit)、推送(push)、合併(merge)等操作。通過自定義 Git Hooks，我們可以在這些事件發生前後執行自定義的操作，例如代碼檢查、自動生成文檔等。

## 如何在 Windows 上編輯 Git Hooks

Git Hooks 儲存在專案的 `.git/hooks` 目錄下。Windows 上的編輯步驟如下：

1. **查看現有 hooks**：
   - 打開你的專案文件夾
   - 找到 `.git/hooks` 目錄 (注意：`.git` 可能是隱藏文件夾)
   - 此目錄包含各種 `.sample` 文件，這些是範例 hook

2. **創建或編輯 hook**：
   - 若要使用範例，複製並移除 `.sample` 後綴
   - 若要創建新的 hook，直接在該目錄下創建對應名稱的文件 (無副檔名)
   - Windows 上建議使用 VSCode、Notepad++ 等編輯器

3. **設置執行權限**：(windows不須此步驟)
   - 在 Windows 上，需確保 Git 能夠執行這些腳本
   - 在 Git Bash 中執行: `chmod +x .git/hooks/hook名稱`

4. **常見 hook 類型**：
   - pre-commit：提交前執行
   - post-commit：提交後執行
   - pre-push：推送前執行
   - post-merge：合併後執行

## 我們的 pre-push Hook 說明

我們專案目前使用的 pre-push hook 會在推送代碼前自動執行 `genSEC.py` 腳本，並根據結果進行相應操作。以下是該 hook 的代碼和功能解釋：

```bash
#!/bin/sh

# Custom hook to run genSEC.py before push
# If genSEC.py runs successfully, commit changes with message "自動更新內頁"
# Always allow the push to proceed, even if genSEC.py fails

echo "Running pre-push hook: Executing genSEC.py..."

# Run genSEC.py
python ./genSEC.py
script_status=$?

# Check if the script ran successfully
if [ $script_status -eq 0 ]; then
    echo "genSEC.py ran successfully"
    
    # Check if there are any changes to commit
    if [ -n "$(git status --porcelain)" ]; then
        echo "Changes detected, committing with message '自動更新內頁'"
        git add .
        git commit -m "自動更新內頁"
    else
        echo "No changes to commit"
    fi
else
    echo "genSEC.py failed with exit code $script_status, but proceeding with push anyway"
fi

# Standard pre-push hook logic to check for WIP commits
remote="$1"
url="$2"

zero=$(git hash-object --stdin </dev/null | tr '[0-9a-f]' '0')

while read local_ref local_oid remote_ref remote_oid
do
	if test "$local_oid" = "$zero"
	then
		# Handle delete
		:
	else
		if test "$remote_oid" = "$zero"
		then
			# New branch, examine all commits
			range="$local_oid"
		else
			# Update to existing branch, examine new commits
			range="$remote_oid..$local_oid"
		fi

		# Check for WIP commit
		commit=$(git rev-list -n 1 --grep '^WIP' "$range")
		if test -n "$commit"
		then
			echo >&2 "Found WIP commit in $local_ref, not pushing"
			exit 1
		fi
	fi
done

exit 0
```

### 功能說明

1. **執行 `genSEC.py`**: 每次推送前自動執行此腳本
2. **檢查執行結果**:
   - 如果腳本執行成功(返回值為0)，檢查是否有文件變更
   - 如有變更，自動提交變更並加上訊息 "自動更新內頁"
   - 如沒有變更，則不進行額外操作
3. **安全推送檢查**:
   - 即使 `genSEC.py` 執行失敗，也會繼續推送過程
   - 檢查是否有標記為 "WIP"(work in progress) 的提交
   - 如果發現 WIP 提交，會阻止推送操作

### Windows 上的特別注意事項

在 Windows 環境中使用 Git hooks 時，有幾點需要特別注意：

1. **路徑分隔符**：Windows 使用反斜線 `\`，但在腳本中應使用正斜線 `/`
2. **換行符**：確保腳本使用 Unix 風格的換行符 (LF)，而非 Windows 風格 (CRLF)
3. **執行環境**：Windows 上的 Git 通常通過 Git Bash 執行 hooks，所以腳本應遵循 bash 語法

## 如何啟用此 pre-push Hook

1. 將上述代碼保存為 `.git/hooks/pre-push` 文件（無副檔名）
2. 在 Git Bash 中執行: `chmod +x .git/hooks/pre-push`
3. 完成後，每次執行 `git push` 時會自動觸發此 hook

透過這個自動化流程，我們可以確保每次程式碼推送前都執行了 `genSEC.py` 腳本，保持文檔的即時更新。