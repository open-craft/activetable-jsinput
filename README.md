# activetable-jsinput

To add an ActiveTable problem to your edX course, follow these steps:

1. Upload the files [`activetable.html`](activetable.html),
   [`activetable.css`](activetable.css) and [`activetable.js`](activetable.js)
   to your course assets using the ["Content > Files & Uploads" menu option in
   edX Studio][upload file]. You can use the "Download ZIP" button on the right
   to download the files to your local file system.  After unzipping the
   archive, you can upload the files to edX Studio.

   These files don't need to be customised to individual problems.  If you want
   to customise them for some reason, make sure to give the customised versions
   problem-specific names.  Colours and font sizes can be customised by editing
   `activetable.css`.

   [upload file]: http://edx.readthedocs.org/projects/edx-partner-course-staff/en/latest/building_course/course_files.html#upload-a-file

1. [Add a "Custom JavaScript Display and Grading"][add jsinput] problem to the
   desired unit in your course.  Click EDIT at the top of the component and
   replace the text in the editor with the raw content of
   [`activetable.xml`](activetable.xml).  (This file shouldn't be uploaded to
   your course assets.)

   [add jsinput]: http://edx.readthedocs.org/projects/edx-partner-course-staff/en/latest/exercises_tools/custom_javascript.html#create-a-custom-javascript-display-and-grading-problem

3. While still in the editor, enter your problem definition following the
   instructions included there.  The definition of the table is included in the
   Python code, while the problem and solution texts follow in the XML code
   towards the end of the file.  Make sure to enable the reset button in the
   settings as explained in the instructions in the XML file.
