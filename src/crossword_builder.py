# Libraries
import json, tkinter as tk

class CrosswordBuilder():
	def __init__(self):
		root = tk.Tk()
		self.root = root
		self.root.title("Crossword Builder")
		self.grid_size = 4 # default size

		# Frame
		self.grid_frame = tk.Frame(self.root)
		self.grid_frame.pack()

		self.control_frame = tk.Frame(self.root)
		self.control_frame.pack(pady=10)

		self.entries = self.build_grid()
		self.entries[0][0].focus_set()

		self.build_across = tk.BooleanVar(value=True) # Default to across
		self.build_controls()

		# Launch
		self.root.mainloop()
		return
	
	# Builds grid
	def build_grid(self):
		grid = []
		for r in range(self.grid_size):
			row_entries = []
			for c in range(self.grid_size):
				entry = self.create_entry(r, c)
				row_entries.append(entry)
			grid.append(row_entries)
		return grid

	# Creates entry tile
	def create_entry(self, r, c):
		entry = tk.Entry(self.grid_frame,
			width=2,
			font=('Arial', 18),
			justify='center',
			fg='white',
			bg='black',
			insertbackground='white'
		)
		entry.grid(row=r, column=c, padx=1, pady=1)

		# Bind Enter key
		entry.bind("<Return>", lambda e, row=r, col=c: self.enter_key(row, col))
		
		# Bind arrow keys
		entry.bind("<Up>", lambda e, row=r, col=c: self.arrow_key(row - 1, col))
		entry.bind("<Down>", lambda e, row=r, col=c: self.arrow_key(row + 1, col))
		entry.bind("<Left>", lambda e, row=r, col=c: self.arrow_key(row, col - 1))
		entry.bind("<Right>", lambda e, row=r, col=c: self.arrow_key(row, col + 1))

		# Spacebar & tab
		entry.bind("<space>", lambda e, ent=entry, row=r, col=c: self.spacebar(entry, row, col))
		entry.bind("<Tab>", lambda e, ent=entry, row=r, col=c: self.spacebar(entry, row, col))

		# Bind key release to update style when a letter is typed
		entry.bind("<KeyRelease>", lambda e, ent=entry, row=r, col=c: self.key_release(e, ent, row, col))

		# Handle backspace
		entry.bind("<BackSpace>", lambda e, ent=entry, row=r, col=c: self.handle_backspace(entry, row, col))
		return entry

	# Hanldes key release
	def key_release(self, event, entry, row, col):
		# Check shift press
		if event.state & 0x0001: 
			self.toggle_build_across()

		# Return on non-letter input
		key = event.char.upper()
		if not key.isalpha():
			return
		
		# Lettered keys
		self.set_text(event, entry, row, col, key)
		if self.build_across.get():
			self.move_cursor(row, col+1) # assume move right
		else:
			self.move_cursor(row+1, col)
		return

	# Handles enter key
	def enter_key(self, row, col):
		self.move_cursor(row+1, 0)
		return

	# Handles arrow keys
	def arrow_key(self, row, col):
		self.move_cursor(row, col)
		return

	# Handles spacebar, tab
	def spacebar(self, entry, row, col):
		if self.build_across.get():
			self.move_cursor(row, col+1)
		else:
			self.move_cursor(row+1, col)
		return "break" # prevents default space insertion

	# Shift-key toggle
	def toggle_build_across(self):
		self.build_across.set(not self.build_across.get())
		return

	# Moves cursor (considers boundaries)
	def move_cursor(self, rrow, rcol): #requested row, requested col
		# Stores max vals
		maxrow = len(self.entries)
		maxcol = len(self.entries[0])

		# Sets cursor coords
		# print(f"Requesting: {rrow}, {rcol}")
		if rcol > maxcol-1:
			# cursor right on right-edge
			rrow = 0 if rrow+1==maxrow else rrow+1
			rcol = 0
		elif rcol < 0:
			# cursor left on left-edge
			rrow = maxrow-1 if rrow-1 < 0 else rrow-1
			rcol = maxcol-1
		elif rrow == maxrow:
			# cursor down on bottom-edge
			rrow = 0
		elif rrow < 0:
			# cursor up on top-edge
			rrow = maxrow-1
	
		# print(f"Setting: {rrow}, {rcol}")
		 # Update cursor
		self.entries[rrow][rcol].focus_set()
		return [rrow, rcol]

	# Handles backspace
	def handle_backspace(self, entry, row, col):
		# Existing text in current entry
		if entry.get().strip():
			entry.delete(0, tk.END) # delete letter 
			entry.config(bg='black', fg='white', insertbackground='white') # reset (for boundary)
			return
		
		# Currently pointing to empty entry
		if self.build_across.get():
			coords = self.move_cursor(row, col-1)
		else:
			coords = self.move_cursor(row-1, col)
		entry = self.entries[coords[0]][coords[1]]
		entry.delete(0, tk.END) # delete letter 
		entry.config(bg='black', fg='white', insertbackground='white') # reset format
		return

	# Updates entry tile
	def set_text(self, event, entry, row, col, key):
		# Updates value
		entry.delete(0, tk.END)
		entry.insert(0, key)
		
		# Updates style
		if entry.get().strip():
			entry.config(bg='white', fg='black', insertbackground='black')
		else:
			entry.config(bg='black', fg='white', insertbackground='white')
		return

	# Build controls; packs onto GUI
	def build_controls(self):
		tk.Button(self.control_frame, text="Add Row + Col", command=self.grow_grid).pack(side='left', padx=5)
		tk.Button(self.control_frame, text="Shrink Row + col", command=self.shrink_grid).pack(side='left', padx=5)
		tk.Checkbutton(
			self.control_frame,
			text="[T/F] Across/Down (Shift)",
			variable=self.build_across,
			onvalue=True,
			offvalue=False
		).pack(side='left', padx=5)
		return

	# Add row + col
	def grow_grid(self):
		if len(self.entries[0]) > 20:
			return  # Max size reached

		currowcount = len(self.entries)
		curcolcount = len(self.entries[0])

		# Adds news column to exisiting rows
		for r in range(currowcount):
			entry = self.create_entry(r, curcolcount)
			self.entries[r].append(entry)

		# Adds new row to grid
		newrow = []
		for c in range(curcolcount+1):
			entry = self.create_entry(curcolcount, c)
			newrow.append(entry)
		self.entries.append(newrow)

		# Updates grid size
		self.grid_size = len(self.entries)
		return

	# Shrink row + col
	def shrink_grid(self):

		if len(self.entries[0]) <= 4:
			return  # Max size reached

		# Removes bottom row
		for entry in self.entries[-1]:
			entry.destroy()
		self.entries.pop()

		# Truncates each row by 1
		for row in self.entries:
			last_entry = row.pop()
			last_entry.destroy()

		# Updates grid_size
		self.grid_size = len(self.entries)
		return

	def submit(self):
		pass