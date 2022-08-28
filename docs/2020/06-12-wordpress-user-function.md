---
description: Create a user in wordpress with php
date: 2020-06-12T12:00:00+0000

meta:
  - name: keywords
    content: 2020 wordpress wp-admin wp-user functions.php php

feed:
  enable: true
---

# Create a user in WordPress with php

A simple function to add an WordPress administrator through code.

```php
add_action('init', 'add_admin_user');
function add_admin_user() {
	$username = 'stephan';
	$password = 'password';
	$email = 'stephan@example.com';

	// Create the new user
	$user_id = wp_create_user( $username, $password, $email );
	if(is_wp_error($user_id)){
		return;
	}
	// Get current user object
	$user = get_user_by( 'id', $user_id );

	// Remove role
	$user->remove_role( 'subscriber' );

	// Add role
	$user->add_role( 'administrator' );
}
```

<disqus />
