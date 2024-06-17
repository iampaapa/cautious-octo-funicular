/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { exec, execSync } from 'node:child_process'
import os from 'node:os'
import path from 'node:path'
import fs from 'node:fs'

import ollamaSetup from '../../../build/ollama/binaries/OllamaSetup.exe?asset'
import ollamaDarwin from '../../../build/ollama/binaries/Ollama-darwin.zip?asset'
import ollamaLinux from '../../../build/ollama/binaries/ollama-linux-arm64?asset'

import '../../../build/ollama/Modelfile?asset'

const { default: ollama } = require('ollama')

const paths = {
  win32: path.join('../../../resources/ollama/models'),
  darwin: path.join('../../../resources/ollama/models'),
  linux: path.join('../../../resources/ollama/models')
}

const binaries = {
  win32: {
    name: 'OllamaSetup.exe',
    localPath: ollamaSetup
  },
  darwin: {
    name: 'ollama-darwin.zip',
    localPath: ollamaDarwin
  },
  linux: {
    name: 'ollama-linux-arm64',
    localPath: ollamaLinux
  }
}

function checkOllama() {
  return new Promise((resolve) => {
    exec('ollama serve', (error) => {
      const ollamaAlreadyRunning = error?.message.includes('listen tcp')
      const ollamaNotInstalled =
        error?.message.includes('not found') ||
        error?.message.includes('not recognized') ||
        error?.message.includes('not internal') ||
        error?.message.includes('not an internal')

      if (ollamaNotInstalled) {
        resolve(false)
      } else if (ollamaAlreadyRunning) {
        resolve(true)
      } else {
        resolve(true)
      }
    })
  })
}

function dir() {
  const operatingSystem = os.platform()
  switch (operatingSystem) {
    case 'darwin':
      return path.join(os.homedir(), 'Solara', 'binaries')
    case 'win32':
      return path.join(os.homedir(), 'AppData', 'Roaming', 'Solara', 'binaries')
    default:
      return path.join(os.homedir(), 'Solara', 'Binaries')
  }
}

function isEnvVarSet(varName, expectedValue) {
  try {
    const currentValue = execSync(`echo $${varName}`).toString().trim()
    return currentValue === expectedValue
  } catch (error) {
    return false
  }
}

async function moveBinaries() {
  const operatingSystem = os.platform()
  const binary = binaries[operatingSystem]
  if (!binary) return 'Not available for this platform'

  const directory = dir()
  const targetPath = path.join(directory, binary.name)

  if (!fs.existsSync(directory)) fs.mkdirSync(directory, { recursive: true })

  // Check if binary already exists in the target directory
  if (fs.existsSync(targetPath)) return 'exists'

  // Move the binary to the target directory
  try {
    fs.copyFileSync(binary.localPath, targetPath)
    return 'success'
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    console.error(`Failed to move binary: ${error.message}`)
    return 'error'
  }
}

function runCommand(command: string) {
  exec(command, (error, _stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error.message}`)
      return
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`)
      return
    }
  })
}

runCommand('ollama list')

async function setupOllama() {
  const ollamaRunning = await checkOllama()
  if (!ollamaRunning) {
    const moveResult = await moveBinaries()
    if (moveResult === 'error') {
      console.error('Failed to move binaries')
      return
    } else if (moveResult === 'exists') {
      console.log('Binaries already exist')
    } else {
      console.log('Binaries moved successfully')
    }
  }

  const platform = os.platform()
  const envVarName = 'OLLAMA_MODELS'
  const envVarValue = paths[platform]

  switch (platform) {
    case 'win32':
      if (!isEnvVarSet(envVarName, envVarValue)) {
        runCommand(`setx ${envVarName} "${envVarValue}"`)
        console.log('Windows environment variable set')
      } else {
        console.log('Windows environment variable already set')
      }
      break
    case 'darwin':
      if (!isEnvVarSet(envVarName, envVarValue)) {
        runCommand(`launchctl setenv ${envVarName} '${envVarValue}'`)
        console.log('macOS environment variable set')
      } else {
        console.log('macOS environment variable already set')
      }
      break
    case 'linux':
      if (!isEnvVarSet(envVarName, envVarValue)) {
        runCommand(`echo 'export ${envVarName}="${envVarValue}"' >> ~/.bashrc && source ~/.bashrc`)
        console.log('Linux environment variable set')
      } else {
        console.log('Linux environment variable already set')
      }
      break
    default:
      console.log('Unsupported OS')
      return
  }

  await new Promise<void>((resolve) =>
    setTimeout(() => {
      1 + 1
      resolve()
    }, 1200)
  )
}

async function invokeLLM(props: { role: string; model: string; content: string }) {
  console.log(`-----`)
  console.log(`[${props.model}]: ${props.content}`)
  console.log(`-----`)
  try {
    console.log(`Running prompt...`)
    const response = await ollama.chat({
      model: props.model,
      messages: [{ role: props.role, content: props.content }]
    })
    console.log(`${response.message.content}\n`)
    return response.message.content
  } catch (error) {
    console.log(`Query failed!`)
    console.log(error)
    return null
  }
}

export { setupOllama, invokeLLM }

// Execute setupOllama during module initialization
setupOllama().then(() => {})
