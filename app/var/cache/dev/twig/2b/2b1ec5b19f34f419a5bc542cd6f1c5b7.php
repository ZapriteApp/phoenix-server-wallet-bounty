<?php

use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Extension\CoreExtension;
use Twig\Extension\SandboxExtension;
use Twig\Markup;
use Twig\Sandbox\SecurityError;
use Twig\Sandbox\SecurityNotAllowedTagError;
use Twig\Sandbox\SecurityNotAllowedFilterError;
use Twig\Sandbox\SecurityNotAllowedFunctionError;
use Twig\Source;
use Twig\Template;

/* index.html.twig */
class __TwigTemplate_170c781133a3ad51de65002c89eab15d extends Template
{
    private $source;
    private $macros = [];

    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->source = $this->getSourceContext();

        $this->blocks = [
            'title' => [$this, 'block_title'],
            'body' => [$this, 'block_body'],
        ];
    }

    protected function doGetParent(array $context)
    {
        // line 2
        return "base.html.twig";
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        $macros = $this->macros;
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f = $this->extensions["Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension"];
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->enter($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof = new \Twig\Profiler\Profile($this->getTemplateName(), "template", "index.html.twig"));

        $this->parent = $this->loadTemplate("base.html.twig", "index.html.twig", 2);
        yield from $this->parent->unwrap()->yield($context, array_merge($this->blocks, $blocks));
        
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->leave($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof);

    }

    // line 4
    public function block_title($context, array $blocks = [])
    {
        $macros = $this->macros;
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f = $this->extensions["Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension"];
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->enter($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof = new \Twig\Profiler\Profile($this->getTemplateName(), "block", "title"));

        yield "Home";
        
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->leave($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof);

        return; yield '';
    }

    // line 6
    public function block_body($context, array $blocks = [])
    {
        $macros = $this->macros;
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f = $this->extensions["Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension"];
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->enter($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof = new \Twig\Profiler\Profile($this->getTemplateName(), "block", "body"));

        // line 7
        yield "<div class=\"home-container\">
    <h1 class=\"page-title\">Home</h1>
    <h2 class=\"section-title\">Balance</h2>
    <div class=\"balance-bar\">
        <a href=\"";
        // line 11
        yield $this->extensions['Symfony\Bridge\Twig\Extension\RoutingExtension']->getPath("pay");
        yield "\" class=\"btn-send no-underline\">Send</a>
        <span class=\"balance-value\">";
        // line 12
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape($this->extensions['Twig\Extension\CoreExtension']->formatNumber(CoreExtension::getAttribute($this->env, $this->source, (isset($context["balance"]) || array_key_exists("balance", $context) ? $context["balance"] : (function () { throw new RuntimeError('Variable "balance" does not exist.', 12, $this->source); })()), "balanceSat", [], "any", false, false, false, 12), 0, ".", ","), "html", null, true);
        yield "</span>
        <a href=\"";
        // line 13
        yield $this->extensions['Symfony\Bridge\Twig\Extension\RoutingExtension']->getPath("receive");
        yield "\" class=\"btn-receive no-underline\">Receive</a>
    </div>
    <h2 class=\"section-title\">Liquidity</h2>
        ";
        // line 16
        $context['_parent'] = $context;
        $context['_seq'] = CoreExtension::ensureTraversable((isset($context["channels"]) || array_key_exists("channels", $context) ? $context["channels"] : (function () { throw new RuntimeError('Variable "channels" does not exist.', 16, $this->source); })()));
        foreach ($context['_seq'] as $context["_key"] => $context["channel"]) {
            // line 17
            yield "        ";
            $context["local_amount"] = (CoreExtension::getAttribute($this->env, $this->source, CoreExtension::getAttribute($this->env, $this->source, CoreExtension::getAttribute($this->env, $this->source, CoreExtension::getAttribute($this->env, $this->source, CoreExtension::getAttribute($this->env, $this->source, CoreExtension::getAttribute($this->env, $this->source, $context["channel"], "commitments", [], "any", false, false, false, 17), "active", [], "any", false, false, false, 17), 0, [], "array", false, false, false, 17), "localCommit", [], "any", false, false, false, 17), "spec", [], "any", false, false, false, 17), "toLocal", [], "any", false, false, false, 17) / 1000);
            // line 18
            yield "        ";
            $context["remote_amount"] = (CoreExtension::getAttribute($this->env, $this->source, CoreExtension::getAttribute($this->env, $this->source, CoreExtension::getAttribute($this->env, $this->source, CoreExtension::getAttribute($this->env, $this->source, CoreExtension::getAttribute($this->env, $this->source, CoreExtension::getAttribute($this->env, $this->source, $context["channel"], "commitments", [], "any", false, false, false, 18), "active", [], "any", false, false, false, 18), 0, [], "array", false, false, false, 18), "localCommit", [], "any", false, false, false, 18), "spec", [], "any", false, false, false, 18), "toRemote", [], "any", false, false, false, 18) / 1000);
            // line 19
            yield "        ";
            $context["total_amount"] = ((isset($context["local_amount"]) || array_key_exists("local_amount", $context) ? $context["local_amount"] : (function () { throw new RuntimeError('Variable "local_amount" does not exist.', 19, $this->source); })()) + (isset($context["remote_amount"]) || array_key_exists("remote_amount", $context) ? $context["remote_amount"] : (function () { throw new RuntimeError('Variable "remote_amount" does not exist.', 19, $this->source); })()));
            // line 20
            yield "        <div class=\"liquidity-bar\">
            <div class=\"balance-progress-orange\"><div class=\"balance-progress\" style=\"width: ";
            // line 21
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape((((isset($context["local_amount"]) || array_key_exists("local_amount", $context) ? $context["local_amount"] : (function () { throw new RuntimeError('Variable "local_amount" does not exist.', 21, $this->source); })()) / (isset($context["total_amount"]) || array_key_exists("total_amount", $context) ? $context["total_amount"] : (function () { throw new RuntimeError('Variable "total_amount" does not exist.', 21, $this->source); })())) * 100), "html", null, true);
            yield "%;\"></div></div>
            <div class=\"balance-bar\">
                <div class=\"text-box left\"><h3>Outbound -></h3>You can send <b>";
            // line 23
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape($this->extensions['Twig\Extension\CoreExtension']->formatNumber((isset($context["local_amount"]) || array_key_exists("local_amount", $context) ? $context["local_amount"] : (function () { throw new RuntimeError('Variable "local_amount" does not exist.', 23, $this->source); })()), 0, ".", ","), "html", null, true);
            yield " sats</b></div>
                <div class=\"text-box center\"><h3>Acinq</h3><b>";
            // line 24
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape($this->extensions['Twig\Extension\CoreExtension']->formatNumber((isset($context["total_amount"]) || array_key_exists("total_amount", $context) ? $context["total_amount"] : (function () { throw new RuntimeError('Variable "total_amount" does not exist.', 24, $this->source); })()), 0, ".", ","), "html", null, true);
            yield " sats</b></div>
                <div class=\"text-box right\"><h3><- Inbound</h3>You can receive <b>";
            // line 25
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape($this->extensions['Twig\Extension\CoreExtension']->formatNumber((isset($context["remote_amount"]) || array_key_exists("remote_amount", $context) ? $context["remote_amount"] : (function () { throw new RuntimeError('Variable "remote_amount" does not exist.', 25, $this->source); })()), 0, ".", ","), "html", null, true);
            yield " sats</b></div>
            </div>
        </div>
        ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['channel'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 29
        yield "    <h2 class=\"section-title\">Offers</h2>
    <p>This is your node's Bolt 12 offer. A static and reusable payment request that does not expire.</p>
    <div class=\"copy-bar\">
        <span class=\"copy-text-12\">";
        // line 32
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape((isset($context["offer"]) || array_key_exists("offer", $context) ? $context["offer"] : (function () { throw new RuntimeError('Variable "offer" does not exist.', 32, $this->source); })()), "html", null, true);
        yield "</span>
        <div id=\"qrcode\" class=\"qrcode\"></div>
        <button class=\"btn-copy\" onclick=\"copyToClipboard('.copy-text-12')\">Copy Text</button>
        <button class=\"btn-qr\" onclick=\"toggleVisibility('qrcode')\">QR Code</button>
    </div>
    <script type=\"text/javascript\">new QRCode(document.getElementById(\"qrcode\"), {text: \"";
        // line 37
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape((isset($context["offer"]) || array_key_exists("offer", $context) ? $context["offer"] : (function () { throw new RuntimeError('Variable "offer" does not exist.', 37, $this->source); })()), "html", null, true);
        yield "\", width: 210, height: 210});</script>
</div>
";
        
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->leave($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof);

        return; yield '';
    }

    /**
     * @codeCoverageIgnore
     */
    public function getTemplateName()
    {
        return "index.html.twig";
    }

    /**
     * @codeCoverageIgnore
     */
    public function isTraitable()
    {
        return false;
    }

    /**
     * @codeCoverageIgnore
     */
    public function getDebugInfo()
    {
        return array (  147 => 37,  139 => 32,  134 => 29,  124 => 25,  120 => 24,  116 => 23,  111 => 21,  108 => 20,  105 => 19,  102 => 18,  99 => 17,  95 => 16,  89 => 13,  85 => 12,  81 => 11,  75 => 7,  68 => 6,  54 => 4,  37 => 2,);
    }

    public function getSourceContext()
    {
        return new Source("{# templates/index.html.twig #}
{% extends 'base.html.twig' %}

{% block title %}Home{% endblock %}

{% block body %}
<div class=\"home-container\">
    <h1 class=\"page-title\">Home</h1>
    <h2 class=\"section-title\">Balance</h2>
    <div class=\"balance-bar\">
        <a href=\"{{ path('pay') }}\" class=\"btn-send no-underline\">Send</a>
        <span class=\"balance-value\">{{ balance.balanceSat|number_format(0, '.', ',') }}</span>
        <a href=\"{{ path('receive') }}\" class=\"btn-receive no-underline\">Receive</a>
    </div>
    <h2 class=\"section-title\">Liquidity</h2>
        {% for channel in channels %}
        {% set local_amount = channel.commitments.active[0].localCommit.spec.toLocal/1000 %}
        {% set remote_amount = channel.commitments.active[0].localCommit.spec.toRemote/1000 %}
        {% set total_amount = local_amount + remote_amount %}
        <div class=\"liquidity-bar\">
            <div class=\"balance-progress-orange\"><div class=\"balance-progress\" style=\"width: {{ local_amount / total_amount * 100 }}%;\"></div></div>
            <div class=\"balance-bar\">
                <div class=\"text-box left\"><h3>Outbound -></h3>You can send <b>{{ local_amount|number_format(0, '.', ',') }} sats</b></div>
                <div class=\"text-box center\"><h3>Acinq</h3><b>{{ total_amount|number_format(0, '.', ',') }} sats</b></div>
                <div class=\"text-box right\"><h3><- Inbound</h3>You can receive <b>{{ remote_amount|number_format(0, '.', ',') }} sats</b></div>
            </div>
        </div>
        {% endfor %}
    <h2 class=\"section-title\">Offers</h2>
    <p>This is your node's Bolt 12 offer. A static and reusable payment request that does not expire.</p>
    <div class=\"copy-bar\">
        <span class=\"copy-text-12\">{{ offer }}</span>
        <div id=\"qrcode\" class=\"qrcode\"></div>
        <button class=\"btn-copy\" onclick=\"copyToClipboard('.copy-text-12')\">Copy Text</button>
        <button class=\"btn-qr\" onclick=\"toggleVisibility('qrcode')\">QR Code</button>
    </div>
    <script type=\"text/javascript\">new QRCode(document.getElementById(\"qrcode\"), {text: \"{{ offer }}\", width: 210, height: 210});</script>
</div>
{% endblock %}
", "index.html.twig", "/var/www/symfony_docker/templates/index.html.twig");
    }
}
