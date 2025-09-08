# Libraries
import json, tkinter as tk

class CrosswordBuilder():
	def __init__(self):
		root = tk.Tk()
		self.root = root
		self.root.title("Crossword Builder")
		self.grid_size = 5

		# Frame
		self.grid_frame = tk.Frame(self.root)
		self.grid_frame.pack()

		self.control_frame = tk.Frame(self.root)
		self.control_frame.pack(pady=10)

		self.entries = self.build_grid()
		self.entries[0][0].focus_set()

		# self.build_controls()

		# Launch
		self.root.mainloop()
		return
	
	def build_grid(self):
		grid = []
		for r in range(self.grid_size):
			row_entries = []
			for c in range(self.grid_size):
				entry = tk.Entry(self.grid_frame,
					width=2,
					font=('Arial', 18),
					justify='center',
					fg='white',
					bg='black',
					insertbackground='white'
				)
				entry.grid(row=r, column=c, padx=1, pady=1)

				# Bind arrow keys
				entry.bind("<Up>", lambda e, row=r, col=c: self.set_cursor(row - 1, col))
				entry.bind("<Down>", lambda e, row=r, col=c: self.set_cursor(row + 1, col))
				entry.bind("<Left>", lambda e, row=r, col=c: self.set_cursor(row, col - 1))
				entry.bind("<Right>", lambda e, row=r, col=c: self.set_cursor(row, col + 1))

				# Bind key release to update style when a letter is typed
				entry.bind("<KeyRelease>", lambda e, ent=entry, row=r, col=c: self.key_release(e, ent, row, col))

				# Handle backspace
				entry.bind("<BackSpace>", lambda e, ent=entry, row=r, col=c: self.handle_backspace(entry, row, col))

				# Append row
				row_entries.append(entry)
			grid.append(row_entries)
		return grid

	# Hanldes key release
	def key_release(self, event, entry, row, col):
		# Returns on navigation keys 
		protected_keys = ["Up", "Down", "Left", "Right", "Tab"]
		if not event.keysym in protected_keys:
			self.set_text(event, entry, row, col)
			self.move_cursor(row, col)
		return

	# Updates entry tile
	def set_text(self, event, entry, row, col):
		# Returns on navigation keys
		if event.keysym in ("Up", "Down", "Left", "Right", "Tab"):
			return
		
		# Return on non-letter input
		key = event.char.upper()
		if not key.isalpha(): return
		entry.delete(0, tk.END)
		entry.insert(0, key)
		
		# Updates style
		if entry.get().strip():
			entry.config(bg='white', fg='black', insertbackground='black')
		else:
			entry.config(bg='black', fg='white', insertbackground='white')
		return

	# Moves cursor (considers boundaries)
	def move_cursor(self, row, col):
		rowcount = len(self.entries)
		colcount = len(self.entries[row])
		colnext = col+1

		# Find cursor coords
		if 0 <= row < rowcount:
			if 0 <= col and colnext != colcount:
				pnext = [row, colnext]
			if colnext == colcount:
				pnext = [row+1, 0]

		self.set_focus(pnext[0], pnext[1]) # Update cursor
		return

	# Sets focus to desired row, col
	def set_cursor(self, row, col):
		self.entries[row][col].focus_set()
		return

	# Handles backspace
	def handle_backspace(self, entry, row, col):
		boundary = False
		# Checks if col at edge
		if col == self.grid_size-1:
			boundary = True
		
		if boundary:
			entry.delete(0, tk.END) # delete letter 
			entry.config(bg='black', fg='white', insertbackground='white') # reset format
		return