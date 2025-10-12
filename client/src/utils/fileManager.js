// File manager to store actual File objects outside of Redux state
// This solves the Redux serialization issue while keeping files accessible

class FileManager {
  constructor() {
    this.files = new Map()
  }

  // Add a file to the manager
  addFile(fileId, file) {
    this.files.set(fileId, file)
  }

  // Get a file by ID
  getFile(fileId) {
    return this.files.get(fileId)
  }

  // Remove a file by ID
  removeFile(fileId) {
    this.files.delete(fileId)
  }

  // Get all files as an array
  getAllFiles() {
    return Array.from(this.files.values())
  }

  // Get files by IDs
  getFilesByIds(fileIds) {
    return fileIds.map(id => this.files.get(id)).filter(Boolean)
  }

  // Clear all files
  clear() {
    this.files.clear()
  }

  // Check if a file exists
  hasFile(fileId) {
    return this.files.has(fileId)
  }

  // Get file count
  getCount() {
    return this.files.size
  }
}

// Create a singleton instance
const fileManager = new FileManager()

export default fileManager
