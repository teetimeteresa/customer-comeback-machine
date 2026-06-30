# Founding Member Social Proof Graphic Generator

You can generate more social proof graphics by navigating to the following URL pattern (ensure the ad-assets-generator dev server is running on port 3006):

http://localhost:3006/ad-assets-generator/founding-member-social-proof?niche=[NICHE]&bizName=[BIZ_NAME]&result=[RESULT_TEXT]&revenue=[REVENUE_VALUE]

## Parameters:
- **niche**: medspa, dental, or salon (controls accent colors)
- **bizName**: Name of the business (URL encoded)
- **result**: The success metric (URL encoded, e.g., "Saved 15 clients this week")
- **revenue**: The estimated value (URL encoded, e.g., "+$3,200")

## Example:
http://localhost:3006/ad-assets-generator/founding-member-social-proof?niche=medspa&bizName=Elite%20Aesthetics&result=Saved%2015%20clients%20this%20week&revenue=%2B%243%2C200
