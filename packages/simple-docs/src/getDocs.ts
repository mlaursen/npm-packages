import { Application, ReflectionKind, type TypeDocOptions } from "typedoc";

export interface Example {
  name: string;
  content: string;
}

export interface SimpleDoc {
  name: string;
  examples: readonly Example[];
}

export interface GetDocsOptions {
  entryPoints?: readonly string[];
}

export async function getDocs(
  options: TypeDocOptions = {}
): Promise<readonly SimpleDoc[]> {
  const app = await Application.bootstrapWithPlugins({
    ...options,
    entryPoints: options.entryPoints ?? ["src/index.ts"],
  });

  const project = await app.convert();
  if (!project) {
    return [];
  }

  const docs = new Map<string, Example[]>();
  for (const { name, signatures = [] } of project.getChildrenByKind(
    ReflectionKind.Function
  )) {
    for (const signature of signatures) {
      const examples = signature.comment?.getTags("@example") ?? [];
      for (const example of examples) {
        const exampleName = example.name;
        if (!exampleName) {
          throw new Error(`${name} has an unnamed example`);
        }

        const currentExamples = docs.get(name) ?? [];
        currentExamples.push({
          name: exampleName,
          content: example.content.map((part) => part.text).join(""),
        });
        docs.set(name, currentExamples);
      }
    }
  }

  const list: SimpleDoc[] = [];
  for (const [name, examples] of docs.entries()) {
    list.push({ name, examples });
  }

  return list;
}
