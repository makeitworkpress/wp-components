<?php
/**
 * Displays a copyright atom
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'copyright'     => '©',
    'date'          => date('Y'),
    'itemtype'      => 'http://schema.org/Organization',
    'name'          => ''
) ); 

$attributes         = MakeitWorkPress\WP_Components\Build::attributes($atom['attributes']); ?>

<div <?php echo $attributes; ?>>
    
    <?php echo $atom['copyright']; ?> <span itemprop="copyrightYear"><?php echo $atom['date']; ?></span> 

    <span itemprop="copyrightHolder" itemscope="itemscope" itemtype="<?php echo $atom['itemtype']; ?>">
        <span itemprop="name"><?php echo $atom['name']; ?></span>    
    </span>
    
</div>