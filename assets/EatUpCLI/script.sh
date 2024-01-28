#!/bin/bash

# Read the contents of the text file into a variable
contents=$(cat image.txt)

# Create a JSON string with the contents
json="{\"image\": \"$contents\"}"

# Write the JSON string to a file
echo "$json" > output.json
