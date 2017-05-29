<?php
/**
 * Displays a copyright atom
 */

// Atom values
$atom = wp_parse_args( $atom, array(
    'copyright'     => '©',
    'date'          => date('Y'),
    'name'          => '',
    'schema'        => 'http://schema.org/Organization',
    'style'         => 'default',
) ); ?>

<div class="atom-copyright <?php echo $atom['style']; ?>" href="<?php echo $atom['url']; ?>" target="<?php echo $atom['target']; ?>">
    
    <?php echo $atom['copyright']; ?> <span itemprop="copyrightYear"><?php echo $atom['style']; ?></span> 

    <span itemprop="copyrightHolder" itemscope="itemscope" itemtype=" <?php echo $atom['schema']; ?>">
        <span itemprop="name"><?php echo $atom['name']; ?></span>    
    </span>
    
</div>