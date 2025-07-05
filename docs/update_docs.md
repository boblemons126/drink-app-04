# Updating DRNKUP Documentation with AI

This guide explains how to use AI assistance to keep your project documentation up-to-date.

## Quick Reference

1. **Start every conversation** with the AI assistant by pasting the contents of `AI_CONTEXT_PROMPT.md`

2. **For feature updates**, ask the AI to:
   ```
   Please update the documentation to reflect the new [feature/change]. 
   Specifically, update:
   - CHANGELOG.md to include the new work
   - DRNKUP_PROJECT_DOCUMENT.md to reflect the changes
   - Create or update a feature spec if needed
   ```

3. **For design changes**, ask the AI to:
   ```
   Please update the documentation to reflect the new design approach for [component/feature].
   Make sure to update relevant sections in DRNKUP_PROJECT_DOCUMENT.md and any affected feature specs.
   ```

4. **For technical implementation changes**, ask the AI to:
   ```
   Please update the technical implementation sections in our documentation to reflect the change from [old approach] to [new approach].
   ```

5. **For new feature specifications**, ask the AI to:
   ```
   Please create a new feature specification for [feature name] in the docs/FEATURE_SPECS/ directory following our template.
   ```

## Best Practices

1. **Regular Updates**: Update documentation after each significant development session
2. **Be Specific**: Tell the AI exactly which aspects of the documentation need updating
3. **Review Changes**: Always review the AI's documentation updates before committing
4. **Keep Context Fresh**: Update the AI_CONTEXT_PROMPT.md file periodically with new development focus
5. **Commit Documentation**: Include documentation updates in your code commits

## Example Workflow

1. Implement a new feature or make significant changes
2. Start a conversation with the AI assistant
3. Paste the AI_CONTEXT_PROMPT.md content
4. Request specific documentation updates
5. Review and adjust the AI's suggestions
6. Commit the updated documentation alongside your code changes

## Documentation Structure Reminder

- **DRNKUP_PROJECT_DOCUMENT.md**: High-level project overview
- **CHANGELOG.md**: Record of all significant changes
- **FEATURE_SPECS/**: Detailed feature specifications
- **README.md**: Documentation guide
- **API_DOCS/**: (Future) API documentation
- **UI_GUIDELINES/**: (Future) Design system documentation 