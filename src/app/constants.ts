  import { FaJava } from "react-icons/fa";
import { SiJavascript, SiPython, SiCplusplus, SiRust, SiPhp } from "react-icons/si";
export  const LANGUAGE_CONFIG = {
  javascript: {
    name: 'JavaScript',
    piston: 'javascript',
    version: '18.15.0',
    starter: 'console.log("Hello, World!");',
    icon: SiJavascript,
  },
  python: {
    name: 'Python',
    piston: 'python',
    version: '3.10.0',
    starter: 'print("Hello, World!")',
    icon: SiPython,
  },
  java: {
    name: 'Java',
    piston: 'java',
    version: '15.0.2',
    starter: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
    icon: FaJava,
  },
  cpp: {
    name: 'C++',
    piston: 'cpp',
    version: '10.2.0',
    starter: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
    icon: SiCplusplus,
  },
  rust: {
    name: 'Rust',
    piston: 'rust',
    version: '1.58.1',
    starter: 'fn main() {\n    println!("Hello, World!");\n}',
    icon: SiRust,
  },
  php: {
    name: 'PHP',
    piston: 'php',
    version: '8.0.3',
    starter: '<?php\n\necho "Hello, World!";\n?>',
    icon:SiPhp,
  },
};