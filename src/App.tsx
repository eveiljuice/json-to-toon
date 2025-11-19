import { useState, useCallback, useMemo } from 'react'
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  useToast,
  HStack,
  IconButton,
  useColorModeValue,
  Flex,
  Icon,
  useColorMode,
  Link,
  Select,
  FormControl,
  FormLabel,
  Switch,
} from '@chakra-ui/react'
import { useDropzone } from 'react-dropzone'
import { Upload, Download, Copy, ArrowRight, Sparkles, Moon, Sun, Github, Code, ArrowLeftRight } from 'lucide-react'
import { encode, decode } from '@toon-format/toon'
import Editor from '@monaco-editor/react'
import { getEncoding } from 'js-tiktoken'

// Tokenizer instance (using cl100k_base which is used by GPT-4)
const tokenizer = getEncoding('cl100k_base')

const CountTokens = ({ text }: { text: string }) => {
  const count = useMemo(() => {
    if (!text) return 0
    try {
      return tokenizer.encode(text).length
    } catch (e) {
      return 0
    }
  }, [text])

  return (
    <HStack spacing={1} color="gray.400" fontSize="sm">
      <Icon as={Sparkles} w={3} h={3} />
      <Text>{count} tokens</Text>
    </HStack>
  )
}

function App() {
  const [jsonInput, setJsonInput] = useState('')
  const [toonOutput, setToonOutput] = useState('')
  const [fileName, setFileName] = useState<string | null>(null)
  const [delimiter, setDelimiter] = useState<',' | '\t' | '|'>(',')
  const [keyFolding, setKeyFolding] = useState<'off' | 'safe'>('off')
  const [mode, setMode] = useState<'json2toon' | 'toon2json'>('json2toon')
  const toast = useToast()
  const { colorMode, toggleColorMode } = useColorMode()

  const editorBg = useColorModeValue('white', '#1e1e1e')
  const headerBg = useColorModeValue('gray.50', '#252526')
  const borderColor = useColorModeValue('gray.200', '#333333')
  const editorTheme = useColorModeValue('vs', 'vs-dark')
  const bg = useColorModeValue('white', 'gray.900')
  const color = useColorModeValue('gray.900', 'white')

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        setJsonInput(text)
        setFileName(file.name)
        try {
          JSON.parse(text)
          handleConvert(text)
        } catch (error) {
          toast({
            title: 'Invalid JSON',
            description: 'The uploaded file contains invalid JSON.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
        }
      }
      reader.readAsText(file)
    }
  }, [toast])

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json'],
    },
    multiple: false,
    noClick: true,
    noKeyboard: true,
  })

  const handleConvert = (input: string = jsonInput) => {
    if (!input.trim()) return

    try {
      if (mode === 'json2toon') {
        const parsed = JSON.parse(input)
        const result = encode(parsed, {
          delimiter,
          keyFolding,
        })
        setToonOutput(result)
      } else {
        // TOON to JSON
        const result = decode(input, {
          strict: true,
          expandPaths: keyFolding === 'safe' ? 'safe' : 'off', // Mirror keyFolding logic
        })
        setToonOutput(JSON.stringify(result, null, 2))
      }
      
      toast({
        title: 'Converted!',
        status: 'success',
        duration: 1500,
        isClosable: true,
        position: 'top',
      })
    } catch (err: any) {
      console.error(err)
      toast({
        title: 'Conversion Error',
        description: err.message || 'Could not convert.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleDownload = () => {
    if (!toonOutput) return
    const blob = new Blob([toonOutput], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    if (mode === 'json2toon') {
      a.download = fileName ? fileName.replace('.json', '.toon') : 'converted.toon'
    } else {
      a.download = fileName ? fileName.replace('.toon', '.json') : 'converted.json'
    }
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleSwitchMode = () => {
    setMode(prev => prev === 'json2toon' ? 'toon2json' : 'json2toon')
    // Swap inputs if possible or just clear
    const temp = jsonInput
    setJsonInput(toonOutput)
    setToonOutput(temp)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(toonOutput)
    toast({
      title: 'Copied to clipboard',
      status: 'info',
      duration: 1500,
    })
  }


  // Editor settings for VSCode look
  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
    lineNumbers: 'on' as const,
    scrollBeyondLastLine: false,
    roundedSelection: false,
    padding: { top: 16, bottom: 16 },
    cursorStyle: 'line' as const,
    automaticLayout: true,
    theme: editorTheme,
  }

  return (
    <Box h="100vh" bg={bg} color={color} transition="background 0.2s, color 0.2s" overflow="hidden" display="flex" flexDirection="column">
      {/* Header */}
      <Box borderBottom="1px" borderColor={borderColor} bg={bg} flexShrink={0}>
        <Container maxW="container.xl" py={3}>
          <Flex justify="space-between" align="center">
            <HStack spacing={8}>
              <HStack spacing={3}>
                <Box w={8} h={8} bg="brand.100" borderRadius="md" display="flex" alignItems="center" justifyContent="center">
                  <img src="/favicon.svg" alt="TOON Logo" style={{ width: '24px', height: '24px' }} />
                </Box>
                <Text fontWeight="bold" fontSize="xl">TOON</Text>
              </HStack>
              
              <HStack spacing={6} display={{ base: 'none', md: 'flex' }}>
                <Link href="https://toonformat.dev/" isExternal fontWeight="medium" color="gray.500" _hover={{ color: 'brand.600' }}>
                  <HStack spacing={1}>
                    <Text>Original Docs</Text>
                    <Icon as={ArrowRight} size={12} transform="rotate(-45deg)" />
                  </HStack>
                </Link>
                <Link href="https://github.com/toon-format/toon" isExternal fontWeight="medium" color="gray.500" _hover={{ color: 'brand.600' }}>
                  <HStack spacing={1}>
                    <Text>Spec Repo</Text>
                    <Icon as={Github} size={14} />
                  </HStack>
                </Link>
              </HStack>
            </HStack>

            <HStack spacing={4}>
              <IconButton
                aria-label="Toggle theme"
                icon={colorMode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                onClick={toggleColorMode}
                variant="ghost"
                color="gray.500"
                _hover={{ color: 'brand.600', bg: 'transparent' }}
              />
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="container.xl" flex={1} display="flex" flexDirection="column" py={6} gap={6} minH={0}>
        
        {/* Top Bar */}
        <Flex justify="space-between" align="end" flexShrink={0} wrap="wrap" gap={4}>
           <VStack align="start" spacing={1}>
              <HStack>
                <Heading size="lg">{mode === 'json2toon' ? 'JSON to TOON' : 'TOON to JSON'}</Heading>
                <IconButton
                  aria-label="Switch mode"
                  icon={<ArrowLeftRight size={20} />}
                  size="sm"
                  variant="ghost"
                  onClick={handleSwitchMode}
                  colorScheme="brand"
                />
              </HStack>
              <Text color="gray.500" fontSize="sm">A compact, human-readable encoding of the JSON data model for LLM prompts.</Text>
           </VStack>
           
           <HStack spacing={2}>
             <Button
                as={Link}
                href="https://github.com/eveiljuice/vscode-toon"
                isExternal
                size="sm"
                leftIcon={<Github size={16} />}
                variant="outline"
                colorScheme="brand"
                _hover={{ textDecoration: 'none', bg: 'brand.50' }}
              >
                GitHub
              </Button>
             <Button
                as={Link}
                href="https://marketplace.visualstudio.com/items?itemName=Timo1153.toon-lang&ssr=false#review-details"
                isExternal
                size="sm"
                leftIcon={<Code size={16} />}
                variant="outline"
                colorScheme="brand"
                _hover={{ textDecoration: 'none', bg: 'brand.50' }}
              >
                VS Code Extension
              </Button>
           </HStack>
        </Flex>

        {/* Converter Area */}
        <Flex flex={1} gap={6} minH={0} direction={{ base: 'column', lg: 'row' }}>
           {/* Input Section */}
           <Box flex={1} display="flex" flexDirection="column" minH={0}>
              <Box 
                flex={1} 
                bg={editorBg} 
                borderRadius="lg" 
                overflow="hidden" 
                display="flex" 
                flexDirection="column" 
                border="1px solid" 
                borderColor={isDragActive ? 'purple.400' : borderColor}
                {...getRootProps()}
              >
                 <Flex bg={headerBg} p={2} borderBottom="1px solid" borderColor={borderColor} justify="space-between" align="center">
                     <Text fontWeight="bold" fontSize="xs">{mode === 'json2toon' ? 'JSON Input' : 'TOON Input'}</Text>
                     <CountTokens text={jsonInput} />
                 </Flex>
                 <Box flex={1} position="relative">
                    <input {...getInputProps()} />
                    <Editor
                      height="100%"
                      defaultLanguage={mode === 'json2toon' ? 'json' : 'yaml'}
                      value={jsonInput}
                      onChange={(value) => setJsonInput(value || '')}
                      theme={editorTheme}
                      options={{ ...editorOptions, wordWrap: 'on' }}
                      loading={<Text p={4} color="gray.500">Loading...</Text>}
                    />
                    {jsonInput === '' && (
                      <Box position="absolute" inset={0} display="flex" alignItems="center" justifyContent="center" pointerEvents="none" bg="transparent">
                        <VStack spacing={4}>
                           <VStack spacing={2} color="gray.500">
                             <Upload size={32} style={{ margin: '0 auto', opacity: 0.5 }} />
                             <Text fontSize="sm">Drag & drop or paste {mode === 'json2toon' ? 'JSON' : 'TOON'}</Text>
                           </VStack>
                           <Button 
                             onClick={(e) => { e.stopPropagation(); open(); }} 
                             size="xs" 
                             variant="outline"
                             pointerEvents="auto"
                           >
                             Upload File
                           </Button>
                        </VStack>
                      </Box>
                    )}
                 </Box>
              </Box>

              <HStack spacing={4} mt={3}>
                <FormControl w="auto">
                  <Select value={delimiter} onChange={(e) => setDelimiter(e.target.value as any)} size="xs" borderRadius="md">
                    <option value=",">Comma (,)</option>
                    <option value="	">Tab (\t)</option>
                    <option value="|">Pipe (|)</option>
                  </Select>
                </FormControl>
                <FormControl display="flex" alignItems="center" w="auto">
                  <FormLabel htmlFor="key-folding" mb="0" fontSize="xs" color="gray.500" mr={2}>Key Folding</FormLabel>
                  <Switch id="key-folding" size="sm" isChecked={keyFolding === 'safe'} onChange={(e) => setKeyFolding(e.target.checked ? 'safe' : 'off')} colorScheme="brand" />
                </FormControl>
                <Button flex={1} colorScheme="brand" size="sm" onClick={() => handleConvert()} isDisabled={!jsonInput} rightIcon={<ArrowRight size={14} />}>
                  Convert
                </Button>
              </HStack>
           </Box>

           {/* Output Section */}
           <Box flex={1} display="flex" flexDirection="column" minH={0}>
              <Box flex={1} bg={editorBg} borderRadius="lg" overflow="hidden" display="flex" flexDirection="column" border="1px solid" borderColor={borderColor}>
                 <Flex bg={headerBg} p={2} borderBottom="1px solid" borderColor={borderColor} justify="space-between" align="center">
                     <Text fontWeight="bold" fontSize="xs">{mode === 'json2toon' ? 'TOON Output' : 'JSON Output'}</Text>
                     <CountTokens text={toonOutput} />
                 </Flex>
                 <Box flex={1} position="relative">
                    <Editor
                      height="100%"
                      defaultLanguage={mode === 'json2toon' ? 'yaml' : 'json'}
                      value={toonOutput}
                      theme={editorTheme}
                      options={{ ...editorOptions, readOnly: true, wordWrap: 'on' }}
                    />
                    <IconButton
                      aria-label="Copy"
                      icon={<Copy size={14} />}
                      size="xs"
                      position="absolute"
                      top={2}
                      right={4}
                      onClick={handleCopy}
                      isDisabled={!toonOutput}
                    />
                 </Box>
              </Box>
              <Button mt={3} variant="outline" colorScheme="brand" size="sm" onClick={handleDownload} isDisabled={!toonOutput} leftIcon={<Download size={14} />}>
                Download {mode === 'json2toon' ? '.toon' : '.json'}
              </Button>
           </Box>
        </Flex>

        {/* Footer */}
        <Flex justify="center" align="center" py={2} flexShrink={0} gap={6} fontSize="xs" color="gray.500" borderTop="1px solid" borderColor={borderColor}>
           <Link href="https://github.com/eveiljuice/json-to-toon" isExternal _hover={{ color: 'brand.500' }}>
             <HStack spacing={1}>
               <Icon as={Github} size={12} />
               <Text>Repository</Text>
             </HStack>
           </Link>
           <Text>Created by <Link href="https://t.me/popdevp" isExternal color="brand.500">@popdevp</Link></Text>
        </Flex>

      </Container>
    </Box>
  )
}

export default App
