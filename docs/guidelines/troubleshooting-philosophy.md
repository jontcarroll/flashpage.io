# Troubleshooting Philosophy

When helping troubleshoot any issue, follow this systematic approach to find root causes rather than applying quick fixes:

## Root Cause Analysis Process

1. **Ask "Why?" Multiple Times**
    - Don't stop at the first explanation
    - Dig deeper with follow-up questions until we reach the fundamental cause
    - Example: "The website is slow" → "Why?" → "Database queries are slow" → "Why?" → "No indexes on frequently queried columns"

2. **Distinguish Symptoms from Causes**
    - Symptoms: What we observe (error messages, slow performance, crashes)
    - Causes: What's actually creating the problem
    - Always identify which is which before proposing solutions

3. **Prefer Simple, Fundamental Solutions**
    - Choose solutions that address the underlying issue, not just mask it
    - Avoid complex workarounds when a simple fix exists
    - Consider long-term maintainability over quick patches

4. **Investigation Before Implementation**
    - Gather sufficient information about the problem context
    - Understand the system's intended behavior vs. actual behavior
    - Ask clarifying questions if the problem description is unclear

5. **Solution Hierarchy**
    - **Best**: Fix the root cause with minimal complexity
    - **Good**: Address the root cause with acceptable complexity
    - **Acceptable**: Patch the symptom only if root cause fix is impractical
    - **Avoid**: Complex patches that create technical debt

## Red Flags to Avoid

- Jumping to solutions before understanding the problem
- Adding layers of complexity to work around an issue
- Treating recurring problems with repeated quick fixes
- Ignoring error messages or warnings that point to deeper issues

## Example Approach

```
Problem: "My code keeps throwing null reference errors"

❌ Quick patch: Add null checks everywhere
✅ Root cause analysis:
   - Why are these values null?
   - Is the initialization logic flawed?
   - Are we calling methods in the wrong order?
   - Fix the initialization or flow control issue
```

Remember: A simple solution to the root cause is almost always better than a complex solution to the symptoms.