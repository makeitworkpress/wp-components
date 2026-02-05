<?php
/**
 * Comments component template
 */
if (post_password_required()) {
    return;
}

$atom["closed"] = !comments_open();
$atom["has_comments"] = get_comments_number();

// Determine file path for comments template
$file_path = str_replace('\\', '/', dirname(__FILE__));
$theme_path = str_replace('\\', '/', TEMPLATEPATH);
$child_path = str_replace('\\', '/', STYLESHEETPATH);

if ($atom["template"]) {
    $file = $atom["template"];
} elseif (strpos($file_path, $theme_path) === 0) {
    $file = str_replace($theme_path, '', $file_path) . '/compatible/comments.php';
} elseif (strpos($file_path, $child_path) === 0) {
    $file = str_replace($child_path, '', $file_path) . '/compatible/comments.php';
} else {
    $file = '';
}

// Store atom in global for template access
$GLOBALS['atom'] = $atom;

if ($file) {
    comments_template($file, $atom["seperate"]);
}
