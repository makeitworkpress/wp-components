<?php
/**
 * Displays a copyright atom
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'copyright'     => '©',
    'date'          => date('Y'),
    'name'          => '',
    'schema'        => 'http://schema.org/Organization'
) ); ?>

<div class="atom-copyright <?php echo $atom['style']; ?>" <?php echo $atom['inlineStyle']; ?> <?php echo $atom['data']; ?>>
    
    <?php echo $atom['copyright']; ?> <span itemprop="copyrightYear"><?php echo $atom['date']; ?></span> 

    <span itemprop="copyrightHolder" itemscope="itemscope" itemtype=" <?php echo $atom['schema']; ?>">
        <span itemprop="name"><?php echo $atom['name']; ?></span>    
    </span>
    
</div>