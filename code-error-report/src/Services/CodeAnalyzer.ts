export interface CodeError {
    fileName: string;
    lineNumber: number;
    error: string;
  }
  
  export function analyzeCodeFiles(files: FileList): CodeError[] {
    const codeErrors: CodeError[] = [];
  
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.readAsText(file);
  
      reader.onload = () => {
        const code = reader.result as string;
        const lines = code.split('\n');
  
        lines.forEach((line, lineNumber) => {
          if (line.includes('error')) {
            const codeError: CodeError = {
              fileName: file.name,
              lineNumber: lineNumber + 1,
              error: line.trim(),
            };
            codeErrors.push(codeError);
          }
        });
      };
    }
  
    return codeErrors;
  }
  