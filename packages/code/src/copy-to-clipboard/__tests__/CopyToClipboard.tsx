import { render, screen, userEvent } from "@react-md/core/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";

import { CopyToClipboard } from "../CopyToClipboard.js";

afterEach(() => {
  vi.resetAllMocks();
});

describe("CopyToClipboard", () => {
  it("should render a tooltipped button with some reasonable defaults", () => {
    render(<CopyToClipboard copyText="Hello, world!" />);

    const button = screen.getByRole("button", { name: "Copy" });
    expect(button).toMatchSnapshot();
  });

  it("should show a tooltip with a default label", async () => {
    const user = userEvent.setup();
    render(<CopyToClipboard copyText="Hello, world!" />);

    const button = screen.getByRole("button", { name: "Copy" });
    await user.hover(button);

    const tooltip = await screen.findByRole("tooltip", {
      name: "Copy to clipboard",
    });
    expect(tooltip).toMatchSnapshot();
  });

  it("should copy the text to the clipboard when clicked and trigger the onCopied prop", async () => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, "writeText");
    const onCopied = vi.fn();
    render(<CopyToClipboard copyText="Hello, world!" onCopied={onCopied} />);

    const button = screen.getByRole("button", { name: "Copy" });

    await user.click(button);
    expect(writeText).toHaveBeenCalledExactlyOnceWith("Hello, world!");
    expect(onCopied).toHaveBeenCalledExactlyOnceWith("Hello, world!");

    await user.click(button);
    expect(writeText).toHaveBeenCalledTimes(2);
    expect(onCopied).toHaveBeenCalledTimes(2);
  });

  it("should not crash and instead call an error function if the clipboard write api failed", async () => {
    const user = userEvent.setup();
    const writeText = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockImplementation(() => Promise.reject(new Error("Permission denied")));
    const onCopied = vi.fn();
    const onCopyFailed = vi.fn();
    render(
      <CopyToClipboard
        copyText="Hello, world!"
        onCopied={onCopied}
        onCopyFailed={onCopyFailed}
      />
    );

    await user.click(screen.getByRole("button", { name: "Copy" }));

    expect(writeText).toHaveBeenCalledExactlyOnceWith("Hello, world!");
    expect(onCopied).not.toHaveBeenCalled();
    expect(onCopyFailed).toHaveBeenCalledExactlyOnceWith(
      new Error("Permission denied")
    );
  });

  it("should allow for a function get get the copy text when clicked instead of a static string", async () => {
    const user = userEvent.setup();
    const onCopied = vi.fn();
    render(
      <CopyToClipboard
        onCopied={onCopied}
        getCopyText={() => "Here is some text!"}
      />
    );

    await user.click(screen.getByRole("button", { name: "Copy" }));

    expect(onCopied).toHaveBeenCalledExactlyOnceWith("Here is some text!");
  });

  it("should not copy if there is no copy text", async () => {
    const user = userEvent.setup();
    const onCopied = vi.fn();
    const onCopyFailed = vi.fn();
    const { rerender } = render(
      <CopyToClipboard
        onCopied={onCopied}
        onCopyFailed={onCopyFailed}
        getCopyText={() => ""}
      />
    );

    const button = screen.getByRole("button", { name: "Copy" });
    await user.click(button);
    expect(onCopied).not.toHaveBeenCalled();
    expect(onCopyFailed).not.toHaveBeenCalled();

    rerender(
      <CopyToClipboard
        onCopied={onCopied}
        onCopyFailed={onCopyFailed}
        copyText=""
      />
    );

    await user.click(button);
    expect(onCopied).not.toHaveBeenCalled();
    expect(onCopyFailed).not.toHaveBeenCalled();
  });

  it("should only cause a type error if the copyText and getCopyText are not provided", async () => {
    const user = userEvent.setup();
    const onCopied = vi.fn();
    const onCopyFailed = vi.fn();

    // @ts-expect-error Missing getCopyText or copyText
    render(<CopyToClipboard onCopied={onCopied} onCopyFailed={onCopyFailed} />);

    await user.click(screen.getByRole("button", { name: "Copy" }));

    expect(onCopied).not.toHaveBeenCalled();
    expect(onCopyFailed).not.toHaveBeenCalled();
  });
});
