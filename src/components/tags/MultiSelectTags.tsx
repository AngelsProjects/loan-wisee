'use client'

import { useState } from 'react'

import { Check, PlusCircle, X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { cn } from '@/lib/utils'

export type Tag = {
  id: string
  name: string
  color?: string
}

interface MultiSelectTagsProps {
  tags: Tag[]
  selectedTags: Tag[]
  onChange: (selectedTags: Tag[]) => void
  onCreateTag?: (name: string) => Promise<Tag | null>
  placeholder?: string
}

export default function MultiSelectTags({
  tags,
  selectedTags,
  onChange,
  onCreateTag,
  placeholder = 'Select tags...'
}: MultiSelectTagsProps) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [newTagDialogOpen, setNewTagDialogOpen] = useState(false)
  const [newTagName, setNewTagName] = useState('')
  const [loading, setLoading] = useState(false)

  const selectedTagIds = selectedTags.map(tag => tag.id)

  const handleSelect = (tag: Tag) => {
    const isSelected = selectedTagIds.includes(tag.id)

    if (isSelected) {
      // Remove tag
      onChange(selectedTags.filter(t => t.id !== tag.id))
    } else {
      // Add tag
      onChange([...selectedTags, tag])
    }
  }

  const handleRemoveTag = (tagId: string) => {
    onChange(selectedTags.filter(tag => tag.id !== tagId))
  }

  const handleCreateNewTag = async () => {
    if (!newTagName.trim() || !onCreateTag) return

    try {
      setLoading(true)
      const newTag = await onCreateTag(newTagName.trim())
      if (!newTag) return
      onChange([...selectedTags, newTag])
      setNewTagName('')
      setNewTagDialogOpen(false)
    } catch (error) {
      console.error('Failed to create new tag:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter tags based on input
  const filteredTags = tags.filter(tag => tag.name.toLowerCase().includes(inputValue.toLowerCase()))

  // Check if input doesn't match any existing tags
  const showCreateOption =
    inputValue.trim() !== '' &&
    !tags.some(tag => tag.name.toLowerCase() === inputValue.toLowerCase()) &&
    onCreateTag !== undefined

  return (
    <div className='relative'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className={cn('w-full justify-between', selectedTags.length > 0 ? 'h-auto min-h-10 flex-wrap' : '')}
            onClick={() => setOpen(!open)}
          >
            <div className='flex flex-wrap gap-1'>
              {selectedTags.length > 0 ? (
                selectedTags.map(tag => (
                  <Badge
                    key={tag.id}
                    variant='secondary'
                    className={cn('mr-1 mb-1', tag.color ? `bg-[${tag.color}]/10 hover:bg-[${tag.color}]/20` : '')}
                  >
                    {tag.name}
                    {/* Use a span with onClick instead of a nested button */}
                    <span
                      className='ring-offset-background focus:ring-ring ml-1 cursor-pointer rounded-full outline-none focus:ring-2 focus:ring-offset-2'
                      onMouseDown={e => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleRemoveTag(tag.id)
                      }}
                    >
                      <X className='text-muted-foreground hover:text-foreground h-3 w-3' />
                    </span>
                  </Badge>
                ))
              ) : (
                <span className='text-muted-foreground text-sm'>{placeholder}</span>
              )}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-full p-0' align='start'>
          <Command>
            <CommandInput placeholder='Search tags...' value={inputValue} onValueChange={setInputValue} />
            <CommandList>
              <CommandEmpty>
                No tag found
                {showCreateOption && (
                  <Button
                    variant='ghost'
                    className='mt-2 flex w-full items-center justify-start'
                    onClick={() => {
                      setNewTagName(inputValue)
                      setNewTagDialogOpen(true)
                      setOpen(false)
                    }}
                  >
                    <PlusCircle className='mr-2 h-4 w-4' />
                    Create tag &quot;{inputValue}&quot;
                  </Button>
                )}
              </CommandEmpty>
              <CommandGroup>
                {filteredTags.map(tag => (
                  <CommandItem key={tag.id} value={tag.name} onSelect={() => handleSelect(tag)}>
                    <div
                      className={cn(
                        'border-primary mr-2 h-4 w-4 rounded-sm border',
                        selectedTagIds.includes(tag.id) ? 'bg-primary text-primary-foreground' : 'opacity-50'
                      )}
                    >
                      {selectedTagIds.includes(tag.id) && <Check className='h-4 w-4' />}
                    </div>
                    {tag.name}
                  </CommandItem>
                ))}
                {showCreateOption && (
                  <CommandItem
                    onSelect={() => {
                      setNewTagName(inputValue)
                      setNewTagDialogOpen(true)
                      setOpen(false)
                    }}
                  >
                    <PlusCircle className='mr-2 h-4 w-4' />
                    Create tag &quot;{inputValue}&quot;
                  </CommandItem>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Create new tag dialog */}
      <Dialog open={newTagDialogOpen} onOpenChange={setNewTagDialogOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Create new tag</DialogTitle>
          </DialogHeader>
          <div className='flex items-center space-x-2 py-4'>
            <Input
              placeholder='Enter tag name'
              value={newTagName}
              onChange={e => setNewTagName(e.target.value)}
              className='flex-1'
              autoFocus
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleCreateNewTag()
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button disabled={!newTagName.trim() || loading} onClick={handleCreateNewTag}>
              {loading ? 'Creating...' : 'Create Tag'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
