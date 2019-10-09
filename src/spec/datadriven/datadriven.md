# Datadriven Tests

This tests implements pure data-driven tests.
Each directory represents a test case with the name of the "dd-" + directoryname.

# Organization

## BOILERPLATE subdirectory

This represents the boilerplate repository. Add files and directories, that
represent the boilerplate.

## PROJECT subdirectory

This is optional, and only needed to test boilerplates that apply to a existing
project.

## RESULT subdirectory

This is the expected result. All files and directories must match exactly, where
"PROJECT" is used a the project name.

## Execution of the test

1. A tempoary working directory is created
2. The BOILERPLATE directory is copied there
3. The PROJECT directory is copied there. If it doesn't exist, a new one is created
4. The BOILERPLATE working directory is initialized as a git repository
5. A git add, and git commit -m"Test" is  executed in the BOILERPLATE working directory
6. The boilerplate is applied to the project directory
7. A deep compare is executed against the RESULT subdirectory