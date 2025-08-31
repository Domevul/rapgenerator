from playwright.sync_api import sync_playwright, expect, Page

def run_verification(page: Page):
    """
    This script verifies that the game can be started and reaches the battle scene.
    It includes a step to wait for the web font to load.
    """
    # 1. Navigate to the game.
    page.goto("http://localhost:5173/rapgenerator/")

    # 2. Wait for the custom font to be loaded by the browser.
    # This is crucial because Phaser renders text to a canvas, and if the font
    # isn't ready, it will render garbled text (tofu).
    try:
        page.evaluate("async () => await document.fonts.load('32px \"Noto Sans JP\"')")
        print("Font 'Noto Sans JP' loaded successfully.")
    except Exception as e:
        print(f"Could not load font: {e}")
        # We'll still try to continue, but it will likely fail.

    # 3. Start the game by clicking on the main menu.
    canvas_locator = page.locator('#app canvas')
    expect(canvas_locator).to_be_visible(timeout=10000)
    canvas_locator.click()

    # 4. Wait for the lyrics selection screen to appear.
    expect(page.get_by_text("歌詞を4つ選択してください")).to_be_visible(timeout=5000)

    # 5. Select the first 4 lyrics.
    page.get_by_text("俺のフロウは最強、ビートを支配する").click()
    page.get_by_text("そのライムじゃ響かない、まるで無音").click()
    page.get_by_text("鉄壁のガード、お前の攻撃は通じない").click()
    page.get_by_text("言葉の盾で、ディスを跳ね返す").click()

    # 6. Click the "Start Battle" button.
    start_button = page.get_by_text("バトル開始")
    expect(start_button).to_be_enabled(timeout=5000)
    start_button.click()

    # 7. Wait for the battle scene to load.
    expect(page.get_by_text("BATTLE START")).to_be_visible(timeout=5000)

    # 8. Take a screenshot for visual verification.
    page.screenshot(path="jules-scratch/verification/battle_scene.png")
    print("Screenshot taken of the battle scene.")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            run_verification(page)
        except Exception as e:
            print(f"An error occurred during verification: {e}")
            page.screenshot(path="jules-scratch/verification/error_screenshot.png")
            print("Error screenshot taken.")
        finally:
            browser.close()

if __name__ == "__main__":
    main()
