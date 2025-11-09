import { Radio } from "@react-md/core/form/Radio";
import { useStorage } from "@react-md/core/storage/useStorage";
import { render, screen, userEvent } from "@react-md/core/test-utils";
import { afterEach, describe, expect, it } from "vitest";

import { PackageManagerProvider } from "../PackageManagerProvider.js";
import type { PackageManager } from "../types.js";
import { usePackageManager } from "../usePackageManager.js";
import { isPackageManager } from "../utils.js";

function Test() {
  const { packageManager, packageManagers, setPackageManager } =
    usePackageManager();

  return (
    <>
      {packageManagers.map((manager) => (
        <Radio
          key={manager}
          name="packageManagers"
          value={manager}
          label={manager}
          checked={manager === packageManager}
          onChange={() => setPackageManager(manager)}
        />
      ))}
    </>
  );
}

describe("PackageManagerProvider", () => {
  afterEach(() => {
    window.localStorage.clear();
  });

  it("should allow child components to control the package manager behavior", () => {
    expect(() => render(<Test />)).toThrow();

    expect(() =>
      render(<Test />, { wrapper: PackageManagerProvider })
    ).not.toThrow();
  });

  it("should default to npm, yarn, and pnpm package managers", async () => {
    const user = userEvent.setup();
    render(<Test />, { wrapper: PackageManagerProvider });

    expect(screen.getAllByRole("radio")).toHaveLength(3);
    const npm = screen.getByRole("radio", { name: "npm" });
    const pnpm = screen.getByRole("radio", { name: "pnpm" });
    const yarn = screen.getByRole("radio", { name: "yarn" });

    expect(npm).toBeChecked();
    expect(pnpm).not.toBeChecked();
    expect(yarn).not.toBeChecked();

    await user.click(pnpm);
    expect(npm).not.toBeChecked();
    expect(pnpm).toBeChecked();
    expect(yarn).not.toBeChecked();

    await user.click(yarn);
    expect(npm).not.toBeChecked();
    expect(pnpm).not.toBeChecked();
    expect(yarn).toBeChecked();
  });

  it("should allow for a default value and on change behavior to store the value externally (like local storage)", async () => {
    function StorageTest() {
      const { value, setValue } = useStorage<PackageManager>({
        key: "packageManager",
        defaultValue: "npm",
        deserializer: (value) => (isPackageManager(value) ? value : "npm"),
      });

      return (
        <PackageManagerProvider
          defaultValue={value}
          onPackageManagerChange={setValue}
        >
          <Test />
        </PackageManagerProvider>
      );
    }

    window.localStorage.setItem("packageManager", "fake");
    const user = userEvent.setup();
    render(<StorageTest />);

    expect(window.localStorage.getItem("packageManager")).toBe("npm");

    await user.click(screen.getByRole("radio", { name: "pnpm" }));
    expect(window.localStorage.getItem("packageManager")).toBe("pnpm");
  });
});
