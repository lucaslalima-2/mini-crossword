# Libraries
import json, tkinter as tk

class CrosswordBuilder():
	def __init__(self):
		root = tk.Tk()
		self.root = root
		self.root.title("Crossword Builder")
		self.grid_size = 5
		self.entries = []

		# Frame
		self.grid_frame = tk.Frame(self.root)
		self.grid_frame.pack()

		self.control_frame = tk.Frame(self.root)
		self.control_frame.pack(pady=10)

		self.build_grid()
		self.entries[0][0].focus_set()

		# self.build_controls()

		# Launch
		self.root.mainloop()
		return
	
	def build_grid(self):
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
				entry.bind("<Up>", lambda e, row=r, col=c: self.focus_cell(row - 1, col))
				entry.bind("<Down>", lambda e, row=r, col=c: self.focus_cell(row + 1, col))
				entry.bind("<Left>", lambda e, row=r, col=c: self.focus_cell(row, col - 1))
				entry.bind("<Right>", lambda e, row=r, col=c: self.focus_cell(row, col + 1))

				# Bind key release to update style when a letter is typed
				entry.bind("<KeyRelease>", lambda e, ent=entry, row=r, col=c: self.update_entry_style(e, ent, row, col))

				# Handle backspace
				entry.bind("<BackSpace>", lambda e, ent=entry, row=r, col=c: self.handle_backspace(entry, row, col))

				# Append row
				row_entries.append(entry)
			self.entries.append(row_entries)

	# Updates entry tile
	def update_entry_style(self, event, entry, row, col):
		# Returns on navigation keys
		if event.keysym in ("Up", "Down", "Left", "Right", "Tab"):
			return
		
		# Return on non-letter input
		content = event.char.upper()
		if not content.isalpha():
			return
		
		entry.delete(0, tk.END)
		entry.insert(0, content)
		
		# Updates style
		if content:
			entry.config(bg='white', fg='black', insertbackground='black')
			self.focus_cell(row, min(col+1, len(self.entries[row])-1) ) # Move right
		else:
			entry.config(bg='black', fg='white', insertbackground='white')
		return

	# Helps navigate with arrow keys
	def focus_cell(self, row, col):
		if 0 <= row < len(self.entries) and 0 <= col < len(self.entries[row]):
			self.entries[row][col].focus_set()
			return self.entries[row][col]
		return None

	# Handles backspace
	def handle_backspace(self, entry, row, col):
		if col == self.grid_size-1: 
			entry = self.focus_cell(row, col)
			content = entry.get().strip()
			if content:
				entry.delete(0, tk.END) # delete letter 
				entry.config(bg='black', fg='white', insertbackground='white') # reset format
				return

		# Clear current cell
		prev_entry = self.focus_cell(row, max(0, col-1)) # set to prev_entry
		prev_entry.delete(0, tk.END)
		prev_entry.config(bg='black', fg='white', insertbackground='white')
		return